'use strict';

const expect = require('expect.js');
const rxFirebase = require('../');
const sinon = require('sinon');

describe('factory', function() {

  it('should bind to a firebase id', function() {
    const firebase = rxFirebase.factory('singpath');
    const ref = firebase();

    expect(ref.toString()).to.be('https://singpath.firebaseio.com/');
  });

  it('should bind to a firebase url', function() {
    const firebase = rxFirebase.factory('https://singpath.firebaseio.com');
    const ref = firebase();

    expect(ref.toString()).to.be('https://singpath.firebaseio.com/');
  });

  it('should throw if asked to bind to an invalid id', function() {
    expect(() => rxFirebase.factory('foo.bar')).to.throwError();
  });

  it('should throw if asked to bind to an invalid url', function() {
    expect(() => rxFirebase.factory('foo.bar.com')).to.throwError();
  });

  it('should reference a path (as string)', function() {
    const firebase = rxFirebase.factory('https://singpath.firebaseio.com');
    const paths = 'foo/bar';
    const ref = firebase(paths);

    expect(ref.toString()).to.be('https://singpath.firebaseio.com/foo/bar');
  });

  it('should reference a path (as array)', function() {
    const firebase = rxFirebase.factory('https://singpath.firebaseio.com');
    const paths = ['foo', 'bar'];
    const ref = firebase(paths);

    expect(ref.toString()).to.be('https://singpath.firebaseio.com/foo/bar');
  });

  describe('RxFirebase', function() {

    it('should be patched', function() {
      expect(rxFirebase.RxFirebase.observe).to.be.ok();
      expect(rxFirebase.RxFirebase.prototype.observe).to.be.ok();
      expect(rxFirebase.RxFirebase.prototype.observeAuth).to.be.ok();
    });

    describe('observe', function() {
      let ref;

      beforeEach(function() {
        const firebase = rxFirebase.factory('singpath');

        ref = firebase();

        sinon.stub(ref, 'on');
        sinon.stub(ref, 'off');
      });

      it('should return an Observable', function() {
        const obs = ref.observe('value');
        const sub = obs.subscribe(() => undefined);

        expect(sub.dispose).to.be.a(Function);
        sub.dispose();
      });

      it('should listen for data changes at a firebase location', function() {
        const snapshot = {};

        ref.on.onFirstCall().yields(snapshot);

        return rxFirebase.RxFirebase.observe(ref, 'value').take(1).toPromise().then(value => {
          sinon.assert.calledOnce(ref.on);
          sinon.assert.calledWithExactly(ref.on, 'value', sinon.match.func, sinon.match.func);
          expect(value).to.be(snapshot);
        });
      });

      it('should return a stream emitting an error on cancel event', function() {
        const err = new Error();

        ref.on.onFirstCall().callsArgWith(2, err);

        return rxFirebase.RxFirebase.observe(ref, 'value').take(1).toPromise().then(
          () => Promise.reject(new Error('unexpected')),
          e => expect(e).to.be(err)
        );
      });

      it('should detach the event handler when unsubscribing to the observable', function() {
        ref.on.onFirstCall().yields({});

        return rxFirebase.RxFirebase.observe(ref, 'value').take(1).toPromise().then(function() {
          const handler = ref.on.getCall(0).args[1];

          sinon.assert.calledOnce(ref.off);
          sinon.assert.calledWithExactly(ref.off, 'value', handler);
        });
      });

    });

    describe('observeAuth', function() {
      let ref;

      beforeEach(function() {
        const firebase = rxFirebase.factory('singpath');

        ref = firebase();

        sinon.stub(ref, 'onAuth');
        sinon.stub(ref, 'offAuth');
        sinon.stub(ref, 'getAuth');
      });

      it('should return an Observable', function() {
        const obs = ref.observeAuth();
        const sub = obs.subscribe(() => undefined);

        expect(sub.dispose).to.be.a(Function);
        sub.dispose();
      });

      it('should listen for auth changes', function() {
        const auth = {};

        ref.onAuth.onFirstCall().yields(auth);

        return ref.observeAuth().take(2).toPromise().then(value => {
          sinon.assert.calledOnce(ref.onAuth);
          sinon.assert.calledWithExactly(ref.onAuth, sinon.match.func);
          expect(value).to.be(auth);
        });
      });

      it('should stop listen for auth changes on dispose', function() {
        ref.onAuth.onFirstCall().yields({});

        return ref.observeAuth().take(2).toPromise().then(function() {
          const handler = ref.onAuth.getCall(0).args[0];

          sinon.assert.calledOnce(ref.offAuth);
          sinon.assert.calledWithExactly(ref.offAuth, handler);
        });
      });

    });

  });

});

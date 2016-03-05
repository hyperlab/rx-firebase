/**
 * Firebase service.
 */
'use strict';

const Firebase = require('firebase');
var Rx = require('rx');

const VALID_ID = /^[-0-9a-zA-Z]{2,}$/;
const VALID_URL = /^https?:\/\/[\da-z\.-]+(\:\d+)?\/?$/;
const ERR_INVALID_ID = 'Invalid Firebase id.';

Firebase.observe = function(ref, eventType) {
  return Rx.Observable.create(observer => {
    const handler = snapshot => observer.onNext(snapshot);
    const onError = err => observer.onError(err);

    ref.on(eventType, handler, onError);

    return () => ref.off(eventType, handler);
  });
};

Firebase.prototype.observe = function(eventType) {
  return Firebase.observe(this, eventType);
};

Firebase.prototype.observeAuth = function() {
  return Rx.Observable.fromEventPattern(
    handler => this.onAuth(handler),
    handler => this.offAuth(handler)
  ).startWith(
    this.getAuth()
  );
};

exports.RxFirebase = Firebase;

/**
 * Create firebase service bound to one firebase ID.
 *
 * Usage:
 *
 *     const rxFirebase = require('rx-firebase');
 *     const firebase = rxFirebase.factory('singpath');
 *     const someUseId = 'google:12345';
 *     const ref = refFactory(['auth/users', someUseId]);
 *
 *     // https://singpath.firebaseio.com/auth/users/google:12345
 *     console.log(ref.toString());
 *
 *     // using firebase +2.4.0 promises, to get a current value
 *     ref.once('value').then(snapshot => console.log(snapshot.val().displayName));
 *
 *     // using our observe utility to get current value and monitor any changes.
 *     firebase.observe(ref, 'value').subscribe(snapshot => console.log(snapshot.val().displayName));
 *     // or the observe method (for Firebase objects only, Query objects won't have this method)
 *     ref.observe('value').subscribe(snapshot => console.log(snapshot.val().displayName));
 *
 *     // To observe auth status
 *     ref.observeAuth().subscribe(auth => console.log(auth));
 *
 * @param  {string}   target Firebase ID or URL.
 * @return {function}
 *
 */
exports.factory = function firebaseFactory(target) {
  let rootPath;

  if (VALID_URL.test(target)) {
    rootPath = target;
  } else if (VALID_ID.test(target)) {
    rootPath = `https://${target}.firebaseio.com`;
  } else {
    throw new Error(ERR_INVALID_ID);
  }

  /**
   * Create firebase instance using a relative path
   *
   * @param  {string|array} path
   * @return {object}            RxFirebase instance
   *
   */
  function firebase(path) {
    const components = path ? [rootPath].concat(path) : [rootPath];
    const ref = new exports.RxFirebase(components.join('/'));

    ref.ServerValue = Firebase.ServerValue;

    return ref;
  }

  firebase.ServerValue = Firebase.ServerValue;
  firebase.observe = Firebase.observe;

  return firebase;
};

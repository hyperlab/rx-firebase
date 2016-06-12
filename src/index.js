/**
 * Firebase RxJS extensions.
 */
'use strict';

const syncList = require('./sync-list');

/**
 * Extends firebase.auth.Auth and firebase.database.Query with methods returning
 * Observable instead of taking callback function.
 *
 * @param  {firebase}   firebase
 * @param  {Observable} Observable A ES stage 1 Observable extended with the
 *                                 "map", "merge" and "scan" operator.
 */
exports.extend = function(firebase, Observable) {

  /**
   * Create an observable emitting user status change.
   *
   * Note: This is creating a cold observable; it will only start watching auth
   * when subscribing to it.
   *
   * @example
   * firebaseApp.auth().observeAuthState().subscribe(
   *   user => console.log('UID: ' + user.uid)
   * );
   *
   * @return {Observable}
   */
  firebase.auth.Auth.prototype.observeAuthState = function() {
    return new Observable(this.onAuthStateChanged.bind(this));
  };

  /**
   * Create a (cold) observable emitting changes over a firebase data reference
   * or query.
   *
   * @example
   * firebaseApp.database().ref('/some/data').observe('value').subscribe(
   *   value => console.log('some data value: ' + value)
   * )
   *
   * @param  {string}     eventType "value", "child_added", "child_removed",
   *                                "child_changed" or "child_moved".
   * @return {Observable}
   */
  firebase.database.Query.prototype.observe = function(eventType, unpack) {
    if (unpack === undefined) {
      unpack = true;
    }

    if (unpack && typeof unpack !== 'function') {
      unpack = ss => ss.val();
    }

    return new Observable(observer => {
      const handler = (snapshot, prev) => observer.next(
        unpackSnapShot(snapshot, prev, eventType, unpack)
      );
      const onError = err => observer.error(err);

      this.on(eventType, handler, onError);

      return () => this.off(eventType, handler);
    });
  };

  /**
   * Create a (cold) observable emitting a firebase data reference
   * sorted array of its children snapshot.
   *
   * @example
   * const ref = firebaseApp.database().ref('/some/data');
   *
   * ref.push().setWithPriority({name: 'first'}, 1);
   * ref.push().setWithPriority({name: 'second'}, 2);
   * ref('/some/data').orderByPriority().observeChildren().subscribe(
   *   list => console.log(list);
   * );
   * // Output:
   * // [{name: 'first'}]
   * // [{name: 'first'}, {name: 'second'}]
   * //
   * // (you could use RxJS `debounce` operator to only emit the list if it's
   * // stable).
   * const otherRef = firebaseApp.database().ref('/some/other/data');
   *
   * otherRef.push().setWithPriority('first', 1);
   * otherRef.push().setWithPriority('second', 2);
   * otherRef('/some/data').orderByPriority().observeChildren().subscribe(
   *   list => console.log(list);
   * );
   * // Output:
   * // [{$value: 'first'}]
   * // [{$value: 'first'}, {$value: 'second'}]
   *
   * @param  {boolean|function} unpack Should the snapshot be unpacked to their values?
   * @return {Observable}              Emit the sorted array of children each time one is updated.
   */
  firebase.database.Query.prototype.observeChildren = function(unpack) {
    // Each child event will be mapped to function to edit the sync-list.
    //
    // Insert a node
    const addChild = this.observe('child_added', unpack).map(ss => list => list.push(ss));
    // Replace a node with a new ss
    const resetChild = this.observe('child_changed', unpack).map(ss => list => list.update(ss));
    // Replace a node with a new ss at a different index
    const moveChild = this.observe('child_moved', unpack).map(ss => list => list.move(ss));
    // Remove a node
    const removeChild = this.observe('child_removed', unpack).map(ss => list => list.remove(ss));

    return addChild.merge(resetChild).merge(moveChild).merge(removeChild).scan(
      (list, fn) => fn(list), syncList.create()
    );
  };
};

function unpackSnapShot(snapShot, prev, eventType, unpack) {
  let result = unpack ? unpack(snapShot) : snapShot;

  if (!Object.isExtensible(result)) {
    result = {$value: result};
  }

  return Object.defineProperties(result, {
    $prev: {value: prev},
    $eventType: {value: eventType},
    $key: {value: snapShot.key},
    $ref: {value: snapShot.ref}
  });
}

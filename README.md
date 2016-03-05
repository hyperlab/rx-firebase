# Rx Firebase

Extends Firebase websocket client with RxJS methods.


## Install

```
npm install rx-firebase
```

## Usage

```
const rxFirebase = require('rx-firebase');
const firebase = rxFirebase.factory('singpath');
const someUseId = 'google:12345';
const ref = refFactory(['auth/users', someUseId]);

// https://singpath.firebaseio.com/auth/users/google:12345
console.log(ref.toString());

// using firebase +2.4.0 promises, to get a current value
ref.once('value').then(snapshot => console.log(snapshot.val().displayName));

// using our observe utility to get current value and monitor any changes.
firebase.observe(ref, 'value').subscribe(snapshot => console.log(snapshot.val().displayName));
// or the observe method (for Firebase objects only, Query objects won't have this method)
ref.observe('value').subscribe(snapshot => console.log(snapshot.val().displayName));

// To observe auth status
ref.observeAuth().subscribe(auth => console.log(auth));
```

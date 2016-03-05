# Rx Firebase

[![Build Status](https://travis-ci.org/dinoboff/rx-firebase.svg?branch=master)](https://travis-ci.org/dinoboff/rx-firebase)
[![Coverage Status](https://coveralls.io/repos/github/dinoboff/rx-firebase/badge.svg?branch=master)](https://coveralls.io/github/dinoboff/rx-firebase?branch=master)
[![Dependency Status](https://gemnasium.com/dinoboff/rx-firebase.svg)](https://gemnasium.com/dinoboff/rx-firebase)


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

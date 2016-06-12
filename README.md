# Rx Firebase

[![Build Status](https://travis-ci.org/dinoboff/rx-firebase.svg?branch=master)](https://travis-ci.org/dinoboff/rx-firebase)
[![Coverage Status](https://coveralls.io/repos/github/dinoboff/rx-firebase/badge.svg?branch=master)](https://coveralls.io/github/dinoboff/rx-firebase?branch=master)
[![Dependency Status](https://gemnasium.com/dinoboff/rx-firebase.svg)](https://gemnasium.com/dinoboff/rx-firebase)


Extends Firebase websocket client with RxJS methods.


## Install

```shell
npm install rx-firebase firebase@3 rxjs
```

## Usage

```javascript
const rxFirebase = require('rx-firebase');
const firebase = require('firebase');
const rx = require('rxjs');

rxFirebase.extend(firebase, rx.Observable);
```

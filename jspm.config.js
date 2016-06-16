SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/",
    "github:": "jspm_packages/github/",
    "rx-firebase/": "src/"
  },
  browserConfig: {
    "baseURL": "/"
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.12"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "rx-firebase": {
      "main": "rx-firebase.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "chai": "npm:chai@3.5.0",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "rxjs": "npm:rxjs@5.0.0-beta.8",
    "sinon": "npm:sinon@1.17.4",
    "sinon-chai": "npm:sinon-chai@2.8.0",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vm": "github:jspm/nodelibs-vm@0.2.0-alpha"
  },
  packages: {
    "npm:sinon@1.17.4": {
      "map": {
        "lolex": "npm:lolex@1.3.2",
        "util": "npm:util@0.10.3",
        "samsam": "npm:samsam@1.1.2",
        "formatio": "npm:formatio@1.1.1"
      }
    },
    "npm:chai@3.5.0": {
      "map": {
        "deep-eql": "npm:deep-eql@0.1.3",
        "assertion-error": "npm:assertion-error@1.0.2",
        "type-detect": "npm:type-detect@1.0.0"
      }
    },
    "npm:deep-eql@0.1.3": {
      "map": {
        "type-detect": "npm:type-detect@0.1.1"
      }
    },
    "npm:formatio@1.1.1": {
      "map": {
        "samsam": "npm:samsam@1.1.3"
      }
    },
    "npm:util@0.10.3": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.6.0"
      }
    },
    "npm:buffer@4.6.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.2",
        "isarray": "npm:isarray@1.0.0",
        "ieee754": "npm:ieee754@1.1.6"
      }
    },
    "npm:rxjs@5.0.0-beta.8": {
      "map": {
        "symbol-observable": "npm:symbol-observable@0.2.4"
      }
    }
  }
});

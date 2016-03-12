# InjectiveCli
[![Travis Build](https://api.travis-ci.org/injectivejs/injective-cli.svg "Travis Build")](https://travis-ci.org/injectivejs/injective-cli)
[![NPM Version](http://img.shields.io/npm/v/injective-cli.svg?style=flat)](https://www.npmjs.org/package/injective-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/injective-cli.svg?style=flat)](https://www.npmjs.org/package/injective-cli)

InjectiveJS cli addon.

## Installation
You must install InjectiveJS to global too.
```shell
$ npm install -g injective
$ npm install -g injective-cli
```

## Command
### ls
Print a dependency tree from a given entry point(s).
```shell
$ injective ls
./lib/main -> /injective/examples/car/lib/main.js [factory]
└─┬ ./car -> /injective/examples/car/lib/car.js [constructor] [singleton]
  ├── logger -> /injective/examples/car/node_modules/logger/index.js
  ├── engine -> /injective/examples/car/node_modules/component-engine/index.js [constructor]
  ├── ./tires -> /injective/examples/car/lib/tires.js [constructor]
  └─┬ addons [bundle]
    └── /injective/examples/car/node_modules/addon-bumper/index.js -> /injective/examples/car/node_modules/addon-bumper/index.js [constructor]
```

## License
MIT
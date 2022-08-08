# config-proxy

[![Version](https://img.shields.io/npm/v/config-proxy.svg)](https://www.npmjs.com/package/config-proxy)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> Interact with your config as if it were a normal JS object.

## Disclaimer

This library is experimental. Certain features may be slow or behave unexpectedly due to how the proxy handles value changes.

## Prerequisites

-   node >=18

## Install

```sh
yarn install config-proxy
```

## Usage

```js
import { ConfigProxy } from "@jdeurt/config-proxy";

// Initializing ConfigProxy will automatically create your config file if it does not already exist
const cfgIni = await ConfigProxy.load("some/path/to/cfg.ini");

// Also supports JSON!
const cfgJson = await ConfigProxy.load("some/path/to/cfg.json", "JSON");

// Changes to your config object will be reflected in the config file
cfgJson.easyAs = [1, 2, 3];

/**
 * cfg.json
 * {
 *     "easyAs": [1, 2, 3]
 * }
 */
```

## Author

👤 **Juan de Urtubey**

-   Website: https://jdeurt.xyz
-   Github: [@jdeurt](https://github.com/jdeurt)

# loopback-component-react-admin

Support [react-admin](https://github.com/marmelab/react-admin) for Loopback 3.0.

## Install on Loopback as a component

### NPM

1. Run `npm install --save loopback-component-react-admin`
2. Set the module in your `component-config.json` (loopback server endpoint).


```json
  "loopback-component-react-admin": {
    "pattern": [
      "*.find"
    ],
    // More options here
  }
```

### Yarn

We recommend to use `yarn` instead of `npm`:

1. `yarn add loopback-component-react-admin`
2. Set the module in your `component-config.json`

```json
  "loopback-component-react-admin": {
    "pattern": [
      "*.find"
    ],
    // More options here
  }
```

## Options

### `pattern`: Array of String

Method patterns that `Content-Range` header will be added.

Accepted patterns: See https://loopback.io/doc/en/lb3/Remote-hooks.html#wildcards.

Default value: `[ "*.find" ]`, which auto added to find method of all models.

## Note

This is the updated version of [loopback3-xTotalCount](https://github.com/kimkha/loopback3-xTotalCount) and [aor-loopback](https://github.com/kimkha/aor-loopback). On client side (mean `react-admin`), we don't need to change anything, just use [ra-data-simple-rest](https://www.npmjs.com/package/ra-data-simple-rest) as usual.

# rollup-plugin-json

Convert .json files to ES6 modules:

```js
// import a single property from a JSON file,
// discarding the rest
import { version } from './package.json';
console.log( `running version ${version}` );

// import the whole file as an object
import pkg from './package.json';
console.log( `running version ${pkg.version}` );
```


## Installation

```bash
npm install --save-dev rollup-plugin-json
```


## Usage

```js
// rollup.config.js
import json from 'rollup-plugin-json';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },

  plugins: [
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      include: 'node_modules/**',
      exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],

      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false

      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  ',

      // ignores indent and generates the smallest code
      compact: true, // Default: false

      // generate a named export for every property of the JSON object
      namedExports: true // Default: true
    })
  ]
};
```


## License

MIT

'use strict';

var rollupPluginutils = require('rollup-pluginutils');

function json(options) {
	if ( options === void 0 ) options = {};

	var filter = rollupPluginutils.createFilter(options.include, options.exclude);
	var indent = 'indent' in options ? options.indent : '\t';

	return {
		name: 'json',

		transform: function transform(json, id) {
			if (id.slice(-5) !== '.json' || !filter(id)) { return null; }

			return {
				code: rollupPluginutils.dataToEsm(JSON.parse(json), {
					preferConst: options.preferConst,
					compact: options.compact,
					namedExports: options.namedExports,
					indent: indent
				}),
				map: { mappings: '' }
			};
		}
	};
}

module.exports = json;
//# sourceMappingURL=rollup-plugin-json.cjs.js.map

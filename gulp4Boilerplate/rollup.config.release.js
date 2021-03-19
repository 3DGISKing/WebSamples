import postcss from 'rollup-plugin-postcss';
import { terser } from "rollup-plugin-terser";

let plugins = [
	postcss({
		extensions: [ '.css' ]
	}),
	terser()
];

const sourceMap = false;

const globals = {

};

export default [
	{
		input: 'src/index.js',
		treeshake: false,
		external: [],
		output: {
			file: 'build/app.js',
			format: 'umd',
			name: 'ConstruktedJs',
			sourcemap: sourceMap,
			globals: globals
		},
		plugins: plugins
	}
]
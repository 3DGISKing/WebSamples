import postcss from 'rollup-plugin-postcss';

let plugins = [
	postcss({
		extensions: [ '.css' ]
	})
];

const globals = {

};

export default [
	{
		input: 'src/index.js',
		treeshake: false,
		external: [],
		output: {
			file: 'app.js',
			format: 'umd',
			name: 'ConstruktedJs',
			sourcemap: true,
			globals: globals
		},
		plugins: plugins
	}
]
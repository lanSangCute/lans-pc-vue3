import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default [
  // UMD for browser-friendly build
  {
    input: 'src/packages/index.ts',
    output: {
      name: 'lans-vue3',
			file: pkg.browser,
			format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript()
    ]
  },
  // CommonJS for Node and ES module for bundlers build
  {
    input: 'src/packages/index.ts',
    external: ['ms'],
    plugins: [
      typescript()
    ],
    output: [
      {  file: pkg.main, format: 'cjs' },
      {  file: pkg.module, format: 'es' }
    ]
  }
]


module.exports = {
	root:true,
	parser: 'vue-eslint-parser',
	parserOptions: {
	  parser: '@typescript-eslint/parser',
	  ecmaVersion: 2020,
	  sourceType: 'module',
	  ecmaFeatures: {
		jsx: true,
	  },
	},
	extends: [
	  'plugin:vue/vue3-recommended',
	  'airbnb-base',
	],
	rules: {
	  'space-before-blocks':0,
	  'key-spacing':0,
	  'comma-dangle': [0, 'never'], //对象字面量项尾不能有逗号
	  'comma-dangle': ["error", {
		  "arrays": "never",
		  "objects": "never",
		  "imports": "never",
		  "exports": "never",
		  "functions": "ignore"
	  }],
	  "quotes":[0, 'single'],
	  'no-var': [
		  'error'
	  ],
	  "no-console":"off",
	  // 自己写一些想配置的规则
	},
	overrides: [
	  {
		files: ['*.vue'],
		rules: {
		  // 单行最大长度
		  'max-len': ['error', { code: 200 }],
		  indent: ['error', 4],
		  'vue/html-indent': ['error', 4],
		  'import/extensions': [
			'error',
			'ignorePackages',
			{
			  js: 'never',
			  jsx: 'never',
			  ts: 'never',
			  tsx: 'never',
			},
		  ],
		},
	  },
	],
	settings: {
	  'import/resolver': {
		alias: {
		  map: [
			['/@', './src'],
		  ],
		  extensions: ['.ts', '.js', '.jsx', '.json', '.vue'],
		},
	  },
	},
  };
  
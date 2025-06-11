// eslint.config.js
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    }
  },
  
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
    ]
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {

      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      // ...
    }
  }
];
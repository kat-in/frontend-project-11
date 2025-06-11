// eslint.config.js
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
    ],
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Разрешить только 1 оператор на строку (по умолчанию)
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
      // Запрет пробелов в конце строк
      '@stylistic/no-trailing-spaces': 'error',

      // Висячие запятые для многострочных структур
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],

      // Обязательная новая строка в конце файла
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      // ...
    },
  },
]

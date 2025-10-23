import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      // Temporarily disable prop-types checks across the codebase to reduce
      // a large amount of noise while we perform a staged cleanup and
      // introduce proper typing/prop validation incrementally.
      'react/prop-types': 'off',
  // Project uses the new JSX transform; importing React in files where
  // it's not directly referenced creates many `no-unused-vars` errors.
  // Set to warn for now to allow incremental cleanup; allow unused top-level
  // `React` imports and underscore-prefixed args.
  'no-unused-vars': ['warn', { 'varsIgnorePattern': '^React$', 'argsIgnorePattern': '^_' }],
  // Turn off some rules that generate noise across large files. We'll
  // progressively re-enable them as we refactor the codebase.
  'no-prototype-builtins': 'off',
  'no-case-declarations': 'off',
  'no-empty': ['warn', { 'allowEmptyCatch': true }],
      // Fast refresh rule can warn when non-component exports exist — keep it as warn.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Turn off rule that enforces React in scope for JSX (not needed with new JSX transform)
      'react/react-in-jsx-scope': 'off',
    },
  },
]

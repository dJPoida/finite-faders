export default [
  {
    ignores: ['dist', 'node_modules', '*.config.*'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
    },
  },
]

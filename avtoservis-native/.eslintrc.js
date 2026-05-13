/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['universe/native'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/'],
};

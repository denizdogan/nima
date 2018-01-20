module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true
  },
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': ['error', { varsIgnorePattern: '^debug$' }],
    'spaced-comment': ['error', 'always']
  }
}

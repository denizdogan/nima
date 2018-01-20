module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': ['error', { varsIgnorePattern: '^debug$' }],
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  }
}

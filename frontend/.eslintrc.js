module.exports = {
  plugins: ['prettier'],
  root: true,
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    react: {
      version: '17.0.1',
    },
  },
  ignorePatterns: ['/*.*'],
  rules: {
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // add this by yying
  },
  overrides: [
    {
      files: ['*.test.tsx'],
      rules: {
        'no-await-in-loop': 0,
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
  ],
};

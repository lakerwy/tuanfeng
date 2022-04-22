/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:30
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-31 14:02:09
 * @Description:
 */
module.exports = {

  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}

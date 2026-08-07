// Use ESM for webpack/Storybook (babel-loader sets caller.name = 'babel-loader');
// use commonjs for CLI transpile and jest.
module.exports = function (api) {
  const isWebpack = api.caller(c => c && c.name === 'babel-loader')
  const isTest = api.env('test')
  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: isTest ? { node: 'current' } : { node: '24' },
          modules: isTest || !isWebpack ? 'commonjs' : false,
        },
      ],
    ],
    plugins: ['@babel/plugin-transform-class-properties'],
    sourceMap: 'inline',
  }
}

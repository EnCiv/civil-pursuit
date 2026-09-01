// Use ESM for webpack/Storybook (babel-loader sets caller.name = 'babel-loader');
// use commonjs for CLI transpile and jest.
module.exports = function (api) {
  const isWebpack = api.caller(c => c && c.name === 'babel-loader')
  const isTest = api.env('test')
  const isDevelopment = api.env('development') || process.env.NODE_ENV === 'development'
  return {
    presets: [
      ['@babel/preset-react', { development: isDevelopment, runtime: 'automatic' }],
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

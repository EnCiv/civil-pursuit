module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest-test-setup.js'],
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['<rootDir>/tmp/', '<rootDir>/node_modules/'],
  // civil-server and civil-client contain JSX/ESM source; they live in
  // node_modules and must be transformed by Babel rather than executed raw.
  // The [\\/] handles both forward-slash (Linux/Mac) and backslash (Windows) paths.
  transformIgnorePatterns: ['[\\\\/]node_modules[\\\\/](?!(civil-server|civil-client|color|color-string|color-convert|color-name|bson)[\\\\/])'],
  // @shelf/jest-mongodb@6 defaults to @swc/jest without JSX; override to enable JSX and .mjs support.
  transform: {
    '^.+\\.m?[jt]sx?$': ['@swc/jest', { jsc: { parser: { syntax: 'ecmascript', jsx: true } } }],
  },
  moduleNameMapper: {
    '^ws$': '<rootDir>/node_modules/ws/index.js',
  },
  roots: ['app'],
  testMatch: ['**/app/**/*tests*/**/*.js'],
}

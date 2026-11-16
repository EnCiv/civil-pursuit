module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest-test-setup.js'],
  watchPathIgnorePatterns: ['<rootDir>/tmp/', '<rootDir>/node_modules/'],
  // civil-server and civil-client contain JSX/ESM source; they live in
  // node_modules and must be transformed by Babel rather than executed raw.
  // The [\\/] handles both forward-slash (Linux/Mac) and backslash (Windows) paths.
  transformIgnorePatterns: ['[\\\\/]node_modules[\\\\/](?!(civil-server|civil-client|color|color-string|color-convert|color-name|bson)[\\\\/])'],
  transform: {
    '^.+\\.m?[jt]sx?$': ['@swc/jest', { jsc: { parser: { syntax: 'ecmascript', jsx: true } } }],
  },
  moduleNameMapper: {
    '^ws$': '<rootDir>/node_modules/ws/index.js',
  },
  roots: ['app'],
  testMatch: ['**/app/**/*tests*/**/*.js'],
}

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest-test-setup.js'],
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['<rootDir>/tmp/', '<rootDir>/node_modules/'],
  // civil-server and civil-client contain JSX/ESM source; they live in
  // node_modules and must be transformed by Babel rather than executed raw.
  // The [\\/] handles both forward-slash (Linux/Mac) and backslash (Windows) paths.
  transformIgnorePatterns: ['[\\\\/]node_modules[\\\\/](?!(civil-server|civil-client)[\\\\/])'],
  moduleNameMapper: {
    '^ws$': '<rootDir>/node_modules/ws/index.js',
  },
  roots: ['app'],
  testMatch: ['**/app/**/*tests*/**/*.js'],
}

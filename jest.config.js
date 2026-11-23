'use strict';

module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/legacy/'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  verbose: true,
};

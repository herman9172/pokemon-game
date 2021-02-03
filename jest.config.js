process.env = {
  STAGE: 'local',
};

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: './tests/unit/.*.ts$',
  testPathIgnorePatterns: ['tests/unit/stubs/'],
  moduleNameMapper: {
    '^@config(.*)$': '<rootDir>/src/config/$1',
    '^@core(.*)$': '<rootDir>/src/core/$1',
    '^@handlers(.*)$': '<rootDir>/src/handlers/$1',
    '^@lib(.*)$': '<rootDir>/src/lib/$1',
    '^@tests(.*)$': '<rootDir>/tests/unit/$1',
  },
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,js}'],
};

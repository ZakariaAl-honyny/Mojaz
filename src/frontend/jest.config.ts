import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next-intl$': '<rootDir>/__mocks__/next-intl.ts',
  },
  testMatch: [
    '**/tests/unit/**/*.test.ts',
    '**/tests/unit/**/*.test.tsx',
    '**/tests/unit/**/*.spec.ts',
    '**/tests/unit/**/*.spec.tsx',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/e2e/',
    '<rootDir>/tests/application-workflow.spec.ts',
    '<rootDir>/tests/core-features.spec.ts',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { useESM: false }],
  },
}

export default createJestConfig(config)

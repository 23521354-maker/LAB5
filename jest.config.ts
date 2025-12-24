import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^react$': 'react'
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts']
}

export default config

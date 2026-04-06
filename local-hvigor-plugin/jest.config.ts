/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2022-2025. All rights reserved.
 */

import type { InitialOptionsTsJest as Config } from 'ts-jest';

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxConcurrency: 8,
  maxWorkers: 8,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/resources/',
    '/test/temp/'
  ],
  testTimeout: 300000,
  testMatch: [
    '**/e2e-test/**/*.ts?(x)',
    '**/jest-test/**/*.ts?(x)',
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)?(long|unit)+(spec|test).ts?(x)'
  ],
  collectCoverageFrom: [
    '**/src/**/*.js'
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover']
};

export default config;

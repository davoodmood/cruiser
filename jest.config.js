// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */

const {defaults} = require('jest-config');
module.exports = {
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    roots: ['<rootDir>/src'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
}
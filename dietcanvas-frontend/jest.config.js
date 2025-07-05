module.exports = {
  projects: [
    '<rootDir>/backend',
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/dietcanvas-frontend/src/**/*.test.js'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    }
  ],
};

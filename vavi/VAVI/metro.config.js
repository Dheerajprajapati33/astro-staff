// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform !== 'ios' && platform !== 'android') {
    if (moduleName === 'react-native-agora') {
      return {
        type: 'sourceFile',
        filePath: path.resolve(__dirname, 'stubs/react-native-agora.js'),
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

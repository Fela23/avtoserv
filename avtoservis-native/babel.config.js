module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@app': './src/app',
            '@presentation': './src/presentation',
            '@domain': './src/domain',
            '@data': './src/data',
            '@shared': './src/shared',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};

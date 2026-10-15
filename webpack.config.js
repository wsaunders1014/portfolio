const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (_env, argv) => {
  const development = argv.mode === 'development';
  const source = path.resolve(__dirname, 'src');

  return {
    // Serve browser modules directly; only the development client is bundled.
    // Only the development server's live-reload client needs bundling.
    entry: development ? { 'dev-server': './scripts/dev-client.js' } : {},
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '_dev/[name].js',
      clean: true
    },
    optimization: { minimize: false },
    devServer: {
      host: 'localhost',
      port: 8080,
      static: [
        { directory: source, watch: true }
      ],
      watchFiles: ['src/**/*'],
      hot: false,
      liveReload: true
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: source,
            to: '.',
            globOptions: { ignore: ['**/.DS_Store'] },
            transform: {
              transformer: (content, resourcePath) => {
                if (!development || resourcePath !== path.join(source, 'index.html')) {
                  return content;
                }
                return content.toString().replace(
                  '</body>',
                  '<script src="/_dev/dev-server.js"></script>\n</body>'
                );
              }
            }
          }
        ]
      })
    ],
    // Static files are copied without bundle-size budgets.
    performance: false
  };
};

const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');
const { bundleLab } = require('./scripts/build-lab.cjs');

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
      { apply(compiler) {
        compiler.hooks.thisCompilation.tap('ComponentLab', compilation => {
          compilation.hooks.processAssets.tap({ name: 'ComponentLab', stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL }, () => {
            const result = bundleLab(development);
            compilation.emitAsset('lab/app.js', new compiler.webpack.sources.RawSource(Buffer.from(result.outputFiles[0].contents)));
            for (const input of Object.keys(result.metafile.inputs)) compilation.fileDependencies.add(path.resolve(__dirname, input));
          });
        });
      } },
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

const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/scripts/app.ts',
    mode: 'development',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'dist', 'scripts'),
      filename: 'app.js'
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            context: path.resolve(__dirname, 'src'),
            from: "*.html",
            to: path.resolve(__dirname, 'dist')
          },
          {
            context: path.resolve(__dirname, 'res'),
            from: "**/*",
            to: path.resolve(__dirname, 'dist', 'res')
          }
        ]
      })
    ]
}
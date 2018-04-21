var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: __dirname + "/public/assets/src/js/app.js",
    output: {
      filename: "app.js",
      path: __dirname + "/public/assets/dist"
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    { 
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: { 
                            includePaths: [ __dirname + "/public/assets/src/scss" ]
                        }
                    }
                ]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "app.css"
        })
    ]
  };
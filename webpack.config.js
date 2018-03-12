module.exports = {
    entry: __dirname + "/src/js/app.js",
    output: {
      filename: "app.js",
      path: __dirname + "/dist"
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {
                    includePaths: [ __dirname + "/src/scss" ]
                }
            }]
        }]
    }
  };
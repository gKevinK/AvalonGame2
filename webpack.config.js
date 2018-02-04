const path = require('path');

module.exports = {
    entry: {
        // main: "./src/App.ts",
        "vendor": ["vue", "socket.io-client"],
        "index": "./src/views/index.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "/dist/static"),
        // path: "./dist/static",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    // target: "node",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", "json", "html"],
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.html$/, loader: "raw-loader" },
        ],

        // preLoaders: [
        //     // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        //     { test: /\.js$/, loader: "source-map-loader" }
        // ]
    },

};
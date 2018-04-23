const path = require('path');

module.exports = {
    entry: {
        // main: "./src/App.ts",
        "vendor": ["vue", "socket.io-client"],
        "index": "./src/views/index.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/static"),
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
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, use: "ts-loader" },
            { test: /\.json$/, use: "json-loader" },
            { test: /\.html$/, use: "raw-loader" },
        ],
    },

};
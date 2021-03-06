const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: {
        // "vendor": [ "vue", "socket.io-client" ],
        "index": "./src/client/index.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/static"),
    },

    devtool: "source-map",
    // target: "node",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".vue", ".json", ".html"],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
    },
    externals: {
        "vue": "Vue",
        // "socket.io-client": "io",
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [ /\.vue$/ ],
                }
            },
            {
                test: /\.css$/,
                use: [ "vue-style-loader", "css-loader" ]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            // { test: /\.html$/, use: "raw-loader" },
        ],
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

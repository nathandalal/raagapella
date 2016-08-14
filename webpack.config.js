module.exports = {
    entry: './client/index.js',
    output: {
        path: './public/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    }
}
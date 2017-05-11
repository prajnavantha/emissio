var webpack = require('webpack');

module.exports = {
    entry: './client/app.js',
    plugins: [
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
   ],
    output:{
        path: __dirname + '/dist',
        publicPath:'/static/',
        filename:'bundle.js'
    },
    module:{

        loaders:[
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query:{
                    presets:['react','es2015']
                }
            },
            {
                test:/\.css/,
                loader: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
            // {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            // {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
            // {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }

        ]
    }
}

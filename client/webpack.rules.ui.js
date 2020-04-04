const styleLoaders = [
    // Creates `style` nodes from JS strings
    'style-loader',
    // Translates CSS into CommonJS
    'css-loader',
    // Compiles Sass to CSS
    'less-loader',
];

module.exports = [
    {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        // options: {},
    },
    {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
    },
    {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    name: '[name].[ext]',
                    limit: false,
                    outputPath: './assets/images/',
                },
            },
        ],
    },
    {
        test: /\.(eot|ttf|woff|woff2)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    limit: false,
                    outputPath: './assets/fonts/',
                },
            },
        ],
    },
    {
        test: /\.s[ac]ss$/i,
        use: styleLoaders,
    },
    {
        test: /\.less$/i,
        use: styleLoaders,
    },
];

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev && 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
    },
};

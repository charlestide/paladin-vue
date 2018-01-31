/**
 * Author: Charles.Tide<charlestide@vip.163.com>
 * Date: 2018/1/31.
 */

module.exports = {
    path: {
        root: '.',
        exclude: ['vendor','node_modules'],
    },
    files: [{
        test: /\.vue$/,
        exclude: []
    }],
    cacheFile: './preloader.mapping.js',
};

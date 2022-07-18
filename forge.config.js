const path = require('path');
module.exports = {
    packagerConfig: {
        name: 'momo-app',
        icon: './public/logo.ico',
    },
    makers: [
        {
            name: './scripts/maker/nsis/index.js',
            config: {
                installerIcon: path.resolve(__dirname, './public/logo.ico'),
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'nokisnojok',
                    name: 'momo-electron',
                },
                draft: false,
                prerelease: false,
            },
        },
    ],
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                mainConfig: './scripts/webpack.main.config.js',
                renderer: {
                    config: './scripts/webpack.renderer.config.js',
                    entryPoints: [
                        {
                            html: './src/index.html',
                            js: './src/renderer.ts',
                            name: 'main_window',
                        },
                    ],
                },
            },
        ],
    ],
};

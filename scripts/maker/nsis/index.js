Object.defineProperty(exports, '__esModule', {
    value: true,
});

const MakerBase = require('@electron-forge/maker-base').default;

const path = require('path');

const appBuilderLib = require('app-builder-lib');

const fs = require('fs').promises;

const dump = require('js-yaml').dump;

class NsisMaker extends MakerBase {
    constructor(makerConfig, ...args) {
        super(makerConfig, ...args);
        this.confog = makerConfig;
        this.name = 'nsis';
        this.defaultPlatforms = ['win32'];
    }
    isSupportedOnCurrentPlatform() {
        return true;
    }

    async buildAppUpdateYML({ dir, forgeConfig }) {
        // 生成app-update.yml
        const filePath = path.resolve(dir, 'resources', 'app-update.yml');
        const githubPublishPublusher = forgeConfig.publishers.find((item) => '@electron-forge/publisher-github');
        if (githubPublishPublusher) {
            const { repository } = githubPublishPublusher.config;
            if (repository) {
                const { owner, name: repo } = repository;

                const appUpdateYMLContent = dump(
                    {
                        owner,
                        repo,
                        provider: 'github',
                        updaterCacheDirName: `${repo}-updater`,
                    },
                    {
                        lineWidth: 8000,
                        skipInvalid: false,
                        noRefs: false,
                    }
                );
                await fs.writeFile(filePath, appUpdateYMLContent);
            }
        }
    }
    async make({ appName, forgeConfig, packageJSON, targetArch, dir, makedir, targetPlatform }) {
        const { installerIcon } = this.config;
        const outputDir = path.resolve(dir, '..', 'make');
        const artifactName = `${appName}.Setup.${packageJSON.version}.exe`;
        const filePath = path.resolve(outputDir, `${artifactName}`);
        const blockmapFilePath = `${filePath}.blockmap`;
        const latestYMLFilePaht = path.resolve(outputDir, 'latest.yml');
        // befere build make app-update.yml
        await this.buildAppUpdateYML({ dir, forgeConfig });
        await appBuilderLib.build({
            prepackaged: dir,
            win: [`nsis:${targetArch}`],
            config: {
                productName: appName,

                directories: {
                    output: path.resolve(dir, '..', 'make'),
                },
                nsis: {
                    installerIcon,
                    artifactName,
                },
            },
        });

        // return filepath for publisher to upload
        return [filePath, blockmapFilePath, latestYMLFilePaht];
    }
}

exports.default = NsisMaker;

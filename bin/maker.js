const _ = require('lodash'),
    fsExtra = require('fs-extra'),
    path = require('path'),
    colors = require('colors'),
    appInfo = require('../package.json'),
    defaultConfig = require("./default-config");


class Maker {

    constructor(config = {}) {
        this.config = defaultConfig;
        this.files = new Map();
        this.config = _.defaultsDeep(config, this.config);
    }
    make() {
        this.scanDir(this.config.path.root);
        // this.scanSelf();
        this.output();
    }
    getConfig() {
        return this.config;
    }

    scanDir(path) {
        let files = fsExtra.readdirSync(path), self = this;
        for (let filename of files) {
            let currentPath = path + '/' + filename;
            if (fsExtra.pathExistsSync(currentPath)) {
                let stat = fsExtra.statSync(currentPath);
                if (stat.isDirectory() && !this.isExcludeDir(filename)) {
                    this.scanDir(currentPath);
                }
                else if (this.isTargetFile(filename)) {
                    this.parseFile(currentPath);
                }
            }
        }
    }

    scanSelf() {
        this.scanDir('./node_modules/' + appInfo.name);
    }

    isExcludeDir(name) {
        return this.isHit(name, this.config.path.exclude);
    }
    isTargetFile(name) {
        return this.isHit(name, this.config.files);
    }
    isHit(name, conditions) {
        if (conditions.length) {
            for (let exp of conditions) {
                if (_.isRegExp(exp) && exp.test(name)) {
                    return true;
                }
                else if (_.isString(exp) && name.indexOf(exp) !== -1) {
                    return true;
                }
                else if (_.isObject(exp)) {
                    if ((_.has(exp, 'test') && _.isRegExp(exp.test) && exp.test.test(name))
                        && (_.has(exp, 'exclude') && !this.isHit(name, exp.exclude))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    parseFile(file) {
        let name = path.basename(file, path.extname(file));
        if (name) {
            let content = fsExtra.readFileSync(file,'utf-8');
            if (content) {
                let matches = content.match(/\bexport\b\s*\bdefault\b\s*{\s*\bname\b\s*:\s*['"]([\S-]+)['"]/);
                if (matches && matches.length > 1) {
                    name = matches[1];
                }
            }
            this.files.set(name, file);


            console.log('Hit file: ' + colors.yellow(file) + ' Parsed Name: ' + colors.yellow(name));


        }
    }
    output() {
        let template = "let PreLoaderMapping = { \n", targetFile = this.config.cacheFile, requireFun = 'import';
        if (process.env.NODE_ENV === 'test') {
            requireFun = 'require';
            this.config.cacheFile = targetFile = '../preloader.mapping.ts';
        }
        this.files.forEach(function (path, name) {
            template += "\"" + name + "\": () => " + requireFun + "(/* webpackChunkName: \"" + name + "\" */ \"" + path + "\"), \n";
        });
        template += "};\n";
        template += "export default PreLoaderMapping; \n";
        // template += "module.exports = PreLoaderMapping; \n";
        fsExtra.writeFileSync(targetFile, template, 'utf-8');
    }
}

module.exports = Maker;



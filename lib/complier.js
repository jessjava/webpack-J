const fs = require('fs');
const path = require('path');
const { getAst, getDependecies, getCode } = require('./parser.js')

module.exports = class Complier{

    /**
     * 构造函数
     * @param {入口，出口等配置} options 
     */
    constructor(options) {
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
        this.modules = [];
    }

    run() {
        console.log(this.entry, this.output);
        const info = this.build(this.entry);
        
        // push第一个模块
        this.modules.push(info);
        // console.log(info);


        this.modules.forEach((module) => {
            const { dependecies } = module;
            if(dependecies){
                for( let dep in dependecies){
                    this.modules.push(this.build(dependecies[dep]));
                }
            }
        })

        const obj = {};
        this.modules.forEach((module) => {
            obj[module.filename] = {
                dependecies: module.dependecies,
                code: module.code
            }
        })
        console.log(obj);
        this.file(obj);
    }
    
    build(filename) {
        let ast = getAst(filename);
        let dependecies = getDependecies(ast, filename);
        let code = getCode(ast);
        return {
            filename,
            dependecies,
            code
        }
    }
    
    file(obj){
        const filePath = path.join(this.output.path, this.output.filename);
        const bundle = `(function(golbal){
            function require(module){
                function _require(path){
                    return require(golbal[module].dependecies[path]);
                }
                var exports = {};
                (function(require, exports, code){
                    eval(code);
                })(_require, exports, golbal[module].code);
                console.log('....', exports);
                return exports;
            }
            require('./src/es6/index.js');
        })(${JSON.stringify(obj)})`;
        fs.writeFileSync(filePath, bundle, 'utf-8');
    }
}
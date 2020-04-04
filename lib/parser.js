const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const { transformFromAst } = require("@babel/core");

module.exports = {
    getAst: (entryPath) => {
        // 入口文件内容，utf-8进行转义
        const entryContent = fs.readFileSync(entryPath, "utf-8");
                
        // 抽象语法树
        const ast = parser.parse(entryContent, {
            sourceType: 'module'
        })
        // console.log(ast.program.body);

        return ast;
    },

    getDependecies: (ast, filename) => {
        const dependecies = {};
        // 提取ast内容
        traverse(ast, {
            // 提取引入的source-value
            ImportDeclaration({ node }){
                const dirname = path.dirname(filename);
                const newFile = `./${path.join(dirname, node.source.value)}`;
                console.log(newFile);
                // 记录引用位置和具体的目录位置
                dependecies[node.source.value] = newFile;
            }
        });
        return dependecies;
    },

    getCode: (ast) => {
        const { code } = transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        });
        return code;
    },
}
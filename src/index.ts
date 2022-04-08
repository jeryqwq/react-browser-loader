import {
  traverse,
  NodePath,
  transformFromAstAsync as babel_transformFromAstAsync,
  transformSync as babel_transformSync,
  transformFromAstSync as babel_transformFromAstSync,
  types as t,
} from '@babel/core';
import {
  parse as babel_parse,
} from '@babel/parser';
import babelPluginTransformModulesCommonjs from '@babel/plugin-transform-modules-commonjs';
// import babelPluginTransformModuleUmd from '@babel/plugin-transform-modules-umd'
// import babelPluginTransformReactJsx from '@babel/plugin-transform-react-jsx';
import preset_react from '@babel/preset-react';
import { parseDeps } from './utils/index';
let moduleCache : Record<string, string> = {};
export default function (config: GlobalConfig) {
  const inputFile = config.entry
  return parseSingleFile(config.files, inputFile, config);
}

function parseSingleFile(files: Record<string, string>, filename: string, config: GlobalConfig): Record<string, any> {
  const ast = babel_parse(files[filename], {
    sourceType: 'module',
    sourceFilename: filename,
    plugins: ['jsx'],
  }); // 是否做一些编译器前的语法转换
  console.log(ast, '---');
  const deps = parseDeps(ast); // 获取当前文件依赖， 是否兼容后期做打包功能
  const transformed = babel_transformFromAstSync(ast, '', {
    presets: [preset_react],
    plugins: [babelPluginTransformModulesCommonjs],
    babelrc: false,
    configFile: false,
    highlightCode: false,
    compact: true,
    comments: false });
    moduleCache[filename] = transformed.code;
  // console.log(transformed, deps, `transformed file${filename}`);
  return createCjsModule(filename, transformed.code, config);
}

function createCjsModule(refPath: string, source: string, config: GlobalConfig) {
  const require = function (relPath) {
    let module
    console.error('require', relPath);
    switch (relPath) {
      case 'react':
        return config.React;
      case 'react-dom':
        return config.ReactDOM;
    }
    if(config.parser.moduleParser) {
      module = config.parser.moduleParser(relPath, config)
    }
    return module || parseSingleFile(config.files, relPath, config);
  };
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const pathResolve = function ({ refPath, relPath }) {
    console.warn('pathResolve', refPath, relPath);
    return config.files[refPath];
  };
  const importFunction = async function (relPath: string) {
    console.log('importFunction', relPath);
    return parseSingleFile(config.files, relPath, config);
  };

  const module = {
    exports: {},
  };
  console.log(source);
  Function('exports', 'require', 'module', '__filename', '__dirname', 'import__', source).call(module.exports, module.exports, require, module, refPath, pathResolve({ refPath, relPath: '.' }), importFunction);
 
  console.log(module, refPath, 'createCjsModule');
  return module.exports;
}
// console.log(window.vdom = createCjsModule('./app.js', moduleCache['./app.js']), '---');

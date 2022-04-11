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
import { defaultPathResolve, getFileType, isCompileFile, parseDeps } from './utils/index';
let moduleCache : Record<string, string> = {};
export default function (config: GlobalConfig) {
  const inputFile = config.entry
  return parseSingleFile(config.files, inputFile, config);
}

function parseSingleFile(files: Record<string, string>, filename: string, config: GlobalConfig): Record<string, any> {
  filename = filename.startsWith('.') ? filename.replace('.', '') : filename;
  // const fileType = getFileType(filename)  // 先不考虑TS的支持
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
  return fileHandler(filename, transformed.code, config);
}
function fileHandler (refPath: string, source: string, config: GlobalConfig) {
  const isParse = isCompileFile(refPath); 
  if(isParse) {
    return createCjsModule(refPath, source, config)
  }
}
function createCjsModule(refPath: string, source: string, config: GlobalConfig) {
  const require = function (relPath) {
    let module
    console.error('require', relPath, refPath);
    switch (relPath) {
      case 'react':
        return config.React;
      case 'react-dom':
        return config.ReactDOM;
    }
    const realPath = defaultPathResolve({ refPath, relPath}).toString()
    if(config.parser.moduleParser) {
      module = config.parser.moduleParser(realPath, config)
    }
    if(isCompileFile(relPath)) {
      return parseSingleFile(config.files, realPath, config);
    }else{
      const fileType = getFileType(relPath)
      config.module[fileType] && config.module[fileType](realPath, config.files[realPath])
    }
    return module
  };
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const pathResolve = function ({ refPath, relPath }) {
    console.warn('pathResolve', refPath);
    if(config.parser.pathParser) {
      config.parser.pathParser(refPath, relPath, config);
    }
  };
  const importFunction = async function (relPath: string) {
    console.log('importFunction', relPath);
    return parseSingleFile(config.files, relPath, config);
  };
  const module = {
    exports: {},
  };
  Function('exports', 'require', 'module', '__filename', '__dirname', 'import__', source).call(module.exports, module.exports, require, module, refPath, pathResolve({ refPath, relPath: '.' }), importFunction);
  console.log(module, refPath, 'createCjsModule');
  return module.exports;
}

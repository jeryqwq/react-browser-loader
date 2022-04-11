import {
  traverse,
  NodePath,
  transformFromAstAsync as babel_transformFromAstAsync,
  types as t,
} from '@babel/core';
import {
	posix as Path
} from 'path'
export function parseDeps(fileAst: t.File): string[] {
  const requireList: string[] = [];

  traverse(fileAst, {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      requireList.push(path.node.source.value);
    },
    CallExpression(path: NodePath<t.CallExpression>) {
      if (
				   // @ts-ignore (Property 'name' does not exist on type 'ArrayExpression')
				   path.node.callee.name === 'require'
				&& path.node.arguments.length === 1
				&& t.isStringLiteral(path.node.arguments[0])
      ) {
        requireList.push(path.node.arguments[0].value);
      }
    },
  });

  return requireList;
}
export const defaultPathResolve = ({ refPath, relPath } : PathContext) => {

	// initial resolution: refPath is not defined
	if ( refPath === undefined )
		return relPath;

	const relPathStr = relPath.toString();
	
	// is non-relative path ?
	if ( relPathStr[0] !== '.' )
		return relPath;
		
	// note :
	//  normalize('./test') -> 'test'
	//  normalize('/test') -> '/test'

	return Path.normalize(Path.join(Path.dirname(refPath.toString()), relPathStr));
}
export const isCompileFile  = (path: string) => {
  const reg = RegExp(/(?:js|jsx|ts)$/)
  return reg.test(path);
}
export const getFileType = (path: string) => {
  return path.split('.').pop();
}

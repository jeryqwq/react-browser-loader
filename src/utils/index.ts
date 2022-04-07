import {
  traverse,
  NodePath,
  transformFromAstAsync as babel_transformFromAstAsync,
  types as t,
} from '@babel/core';
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

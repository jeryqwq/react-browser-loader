declare type GlobalConfig = {
  el: HTMLElement,
  files: Record<string, string>,
  React: any,
  ReactDOM: any,
  entry: string, // 入口文件
  parser: {
    moduleParser?: (relaPath: string, config: GlobalConfig) => any,
    pathParser?:(relPath: string,refPath: string, config: GlobalConfig) => string, // 钩子， 解析文件后会调用执行, 如 addStyle, 解析scss...
  },
  module: {
    'css'?: (path: string, source: string) => void
    'scss'?: (path: string, source: string) => void
    'stylus'?: (path: string, source: string) => void
  }
}
declare type  AbstractPath = {
	toString() : string,
}
declare type PathContext = {
	/** reference path */
	refPath : AbstractPath,
	/** relative to @refPath */
	relPath : AbstractPath,
}


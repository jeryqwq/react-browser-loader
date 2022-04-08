declare type GlobalConfig = {
  el: HTMLElement,
  files: Record<string, string>,
  React: any,
  ReactDOM: any,
  entry: string, // 入口文件
  addStyle:(styleContent: string) => void,
  parser: {
    moduleParser?: (_: string, config: GlobalConfig) => any,
    pathParser?:(_: string, config: GlobalConfig) => string,
  },
}


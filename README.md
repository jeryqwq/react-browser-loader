# react-browser-loader
在前端浏览器环境内编译react多文件代码，包含插件机制，可基于此定制开发专属你的前端在线编码平台或者前端物料平台
<img src="./demo.jpg"/>

### Demo
```js
import loader from 'react-browser-loader'
import React from 'react';
import ReactDOM from 'react-dom';
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
  }
}
loader({
  el: document.getElementById('app') as HTMLElement,
  React,
  ReactDOM,
  entry: './app.js', // 入口文件
  files: { // 所有文件内容
      './app.js': `
      import CompA from './a.js'
        const a = <div style={{color: 'red'}}>456</div>
        export const b = 3;
        export default function () {
          return <div>
          <h1 style={{color: 'red'}}>这是appjs组件</h1>
          <CompA />
          </div>
        }
      `,
      './a.js': `
        export default function () {
          return <div>a.js CompA</div>
        }
      `,
    './index.jsx': `
      import CompA from './CompA.jsx';
      export default function () {
        return (
          <div>
            <h1> Render React Mode </h1>
          </div>
        )
      }
    `,
    './CompA.jsx': `
    export default function (props) {
      console.log(props, '================================')
      return (
        <div>
          <h1> ./CompA.jsx </h1>
        </div>
      )
    }
    `
  }
})


```

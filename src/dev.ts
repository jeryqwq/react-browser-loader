import loader from './index'
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
  }
}
loader({
  el: document.getElementById('app') as HTMLElement,
  React: window.React as any,
  ReactDOM: window.ReactDOM as any,
  entry: './app.js',
  files: {
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

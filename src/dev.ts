import loader from './index'
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
  }
}
const config = {
  el: document.getElementById('app') as HTMLElement,
  React: window.React as any,
  ReactDOM: window.ReactDOM as any,
  entry: './app.js',
  addStyle: (str) => {
    console.log(`you should add style, content:${str}`)
  },
  files: {
      './demo.jpg': `http://10.28.184.32/ssa-vis/vis-components/react-browser-loader/raw/main/demo.jpg`,
      './demo2.jpg': `https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg`,
      './app.js': `
        import CompA from './a.js';
        import  {useState} from 'react';
        // import demo from './demo.jpg';
        const a = <div style={{color: 'red'}}>456</div>
        export const b = 3;
        export default function (props) {
          console.log(props, '----')
          const [count, setCount] = useState(0)
          return <div>
          <h1 >Count: {count}</h1>
          <h1 style={{color: 'red', cursor: 'pointer'}} onClick={() => setCount(count + 1)}>这是appjs组件 点我++</h1>
          <CompA />
          </div>
        }
      `,
      './a.js': `
        import  {useState} from 'react';
        export default function () {
          const [count, setCount] = useState(0)
          return <div  onClick={() =>setCount(count + 1)}>a.js CompA counter: {count}</div>
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
  },
  parser: {
    
  }
}
const App = loader(config)
window.ReactDOM.render(window.React.createElement(App.default,  {a: 1}), config.el)

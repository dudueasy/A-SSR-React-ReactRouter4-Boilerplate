# React & React Router 4 Server Side Rendering Boilerplate
## Solutions: 
* 前端路由: react-router 4

* store: react 原生 state


## 初始化工作和启动程序 
* 初始化
```
npm install
```

* 启动程序
```
npm run start-dev
```

## 流程概述
* 服务端数据服务
    * 服务端提供一个接口, 用于提供数据给服务器内部以及前端页面
~~~
app.get("/api/news", (req, res) => {
  res.json(stateObj)
})
~~~

* ​初始数据的同步
    * 服务端返回的页面 (服务端渲染后的页面) 中的组件是有状态的. 客户端收到数据时, 这些组件已经存在真实 DOM 中, 由于未在 VDOM 上生成, 所以客户端的VDOM中没有状态.  这导致组件无法和 react 交互.

    * 我们需要在客户端的 VDOM 中重新生成状态.
    * 通过模板中插入 script 的方式将状态传递到客户端
    * ​在组件中的 ```constructor()``` 中 中生成 VDOM 上的状态, 将服务端渲染到真实 DOM 的组件和 VDOM 中的组件完全同步
    
~~~
res.render(
`
...
<script>window.__initialData__ =${initialData }</script>
...
`
)
~~~
 


~~~
// 组件内部代码

constructor(props) {
    super(props);
    let initialData

    // this.props.initialData is only available on server
    if (this.props.initialData) {
      initialData = this.props.initialData
    } 

    // on client there is not this.props.initialData
    else {
      initialData = window.__initialData__
      delete window.__initialData__
    } 

    this.state = { news: initialData }
  }
~~~

* ​引入 React Router, 服务端动态响应组件和数据
  * 让用户以任何路径开始请求服务端渲染页面的时候都能获得对应的组件和数据.
  * 在每个组件上都添加一个 API 用来获取所需的数据

  * 利用 req.url 和 StaticRouter 实现动态响应以及组件传参
  * 服务端应用 ```<StaticRouter>```
  * ```<StaticRouter>``` 可以同构 ```location``` 属性来触发对应的 ```<Router>```, 实现动态渲染组件. 
  * ```<StaticRouter>``` 可以通过 ```context``` 属性传数据 给 <Router> 对应的组件, 组件通过 ```props.staticContext``` 访问到这个数据.

~~~ 
// server entry
app.get("*", (req, res) => {

---伪代码开始---
根据 req.url 判断请求的是哪个组件
调用对应组件提供的 API 来获取数据initialData

Promise.resolve(initialData)
---伪代码结束---

    .then(initialData => {
      const context = {initialData}
      const markup = renderToString(
        <StaticRouter  context={context} location={req.url}>
          <App />
        </StaticRouter>
      )
  
    res.send(
`
...
          <script>window.__initialData__ =${JSON.stringify(initialData)}</script>
...
          <div id="root">${markup}</div>
...

`
)
~~~

 * ​重写组件, 使用 props.staticContext 来设置组件在服务端渲染时的 state

* ​前端路由时的数据获取
  * 前端路由时, 组件是由 react 渲染的, 不包含数据, ```componentDidMount``` 可用. 
  * 在 ```componentDidMount``` 中访问服务器 API 获取数据, 并且 ```setState``` 初始化数据.

~~~
 componentDidMount() {
    if (!this.state.news) {
      News.requestInitialData()
        .then(initialData => this.setState({ news: initialData }))
    }
  }
~~~








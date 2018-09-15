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
    * 服务端提供接口, 响应数据给服务端渲染的组件以及前端组件
~~~
app.get("/api/news", (req, res) => {
  res.json(stateObj)
})
~~~

* ​初始数据的同步
    * 服务端渲染的代码中, 我们给组件传递了props, 并且通过 props 设置了状态. 
    * 在客户端渲染的代码中, 我们要使用服务器传递的数据来动态地设置组件状态.

    * 这个示例将会使用模板中插入 script 的方式将数据传递到客户端
    * ​在组件的 ```constructor()``` 中生成组件的状态.
    
~~~
res.send(
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
    if (props.initialData) {
      initialData = props.initialData
    } 
    // on client we don't pass props to component, we take data from window object
    else {
      initialData = window.__initialData__
      delete window.__initialData__
    } 

    this.state = { news: initialData }
  }
~~~

* ​引入 React Router, 实现服务端动态响应组件和数据
  * 让用户以任何路径开始请求服务端渲染页面的时候都能获得对应的组件和数据.
  * 在每个组件上都添加一个 API 用来获取所需的数据

  * 利用 req.url 和 StaticRouter 实现动态响应以及组件传参
  * 服务端应用 ```<StaticRouter>```
    * ```<StaticRouter>``` 可以通过 ```location``` 属性来触发相应 ```<Router>```, 实现动态渲染组件. 
    * ```<StaticRouter>``` 可以通过 ```context``` 属性传数据给 ```<Router>``` 渲染的组件, 组件通过 ```props.staticContext``` 访问到```context```数据.

~~~ 
// server entry
app.get("*", (req, res) => {

---伪代码开始---
根据 req.url 判断请求的是哪个组件
调用对应组件上的数据接口来获取初始数据initialData

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
  * 前端路由时, 组件是由 react 渲染(mount) 的, 不包含数据, ```componentDidMount``` 可用. 
  * 在 ```componentDidMount``` 中访问服务器 API 获取数据, 并且 ```setState``` 初始化数据.

~~~
 componentDidMount() {
    if (!this.state.news) {
      News.requestInitialData()
        .then(initialData => this.setState({ news: initialData }))
    }
  }
~~~








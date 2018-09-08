import React, { Component } from "react";
import NewsList from "./NewsList";
import Axios from 'axios'

class News extends Component {
  constructor(props) {
    console.log('constructor is called')
    console.log(`props: ${JSON.stringify(props)}`)

    super(props);
    let initialData
    // props is only available on server
    // props.staticContext is exposed by <StaticRouter> 
    if (props.staticContext) {
      initialData = props.staticContext
    }
    // on client component can't receive props that has initialData 
    else {
      console.log(111)
      initialData = window.__initialData__
      delete window.__initialData__
    }
    this.state = { news: initialData }
  }

  static requestInitialData() {
    return Axios('http://localhost:3000/api/news')
      .then(result => result.data)
  }

  componentDidMount() {
    // if this component is render on client side for the first (with no state)
    // than fetch data through API
    if (!this.state.news) {
      News.requestInitialData()
        .then(initialData => this.setState({ news: initialData }))
    }
  }

  render() {
    return <NewsList news={this.state.news} />;
  }
}

export default News;

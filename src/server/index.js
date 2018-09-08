import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import App from "../shared/App";
import routes from '../shared/routes'
import serialize from 'serialize-javascript'

if (process.env.NODE_ENV === 'development') { 
  require('source-map-support').install();
}

const app = express();

app.use(express.static("public")); 

app.get("/api/news", (req, res) => {
  res.json([
    {
      id: 1,
      upvotes: 250,
      title: "Fianto Duri, the complete tutorial",
      author: "rubeush",
      data: Date.now() - 10000000
    }, {
      id: 2,
      upvotes: 300,
      title: "Fianto Duriiiiii, the complete tutorial",
      author: "rubeush",
      data: Date.now() - 10000010
    },
    {
      id: 3,
      upvotes: 100,
      title: "Fianto Duriiiiiiizzziiiiii, the complete tutorial",
      author: "rubeush",
      data: Date.now() - 10000005
    }
  ])
})

app.get("*", (req, res) => {
  // user react-router matchPath to check if a route (config object) match current request.
  // user requestInitialData from current component to ge initial State data
  const currentRoute = routes.find(route => matchPath(req.url, route))
  const requestInitialData = currentRoute.component.requestInitialData && currentRoute.component.requestInitialData()

  Promise.resolve(requestInitialData)
    .then(initialData => {
      const context = { initialData }
      const markup = renderToString(
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      )

      res.send(`
      <!DOCTYPE html>
        <head>
          <title>React & React Router4 SSR</title>
          <link rel="stylesheet" href="/css/main.css">
          <script src="/bundle.js" defer></script>
          <script>window.__initialData__ =${serialize(initialData)}</script>
        </head>

        <body>
          <div id="root">${markup}</div>
        </body>
      </html>
  `);
    });
})

let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

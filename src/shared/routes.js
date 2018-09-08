import News from "./news/News";
import Home from './home/Home';

// routes is used to iterately create <Route>
const routes = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/news",
    component: News
  }
];

export default routes;

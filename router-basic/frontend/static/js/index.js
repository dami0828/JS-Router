import Home from "../views/Home.js";
import NotFound from "../views/NotFound.js";
import Posts from "../views/Posts.js";
import PostDetail from "../views/PostDetail.js";
import MyPage from "../views/MyPage.js";

const NOT_FOUND_ROUTE = {
  path: "/404",
  view: NotFound,
};
const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const updateUrlRoute = (url) => {
  history.pushState(null, "", url);
  getRouter();
};

const resolveRoute = (routes) => {
  const path = window.location.pathname;
  const matchedRoute =
    routes.find((route) => path.match(pathToRegex(route.path))) ??
    NOT_FOUND_ROUTE;
  renderView(matchedRoute.view());
};

const renderView = (view) => {
  const appElement = document.getElementById("app");
  if (appElement) appElement.innerHTML = view;
};

const getRouter = () => {
  const routes = [
    { path: "/", view: Home },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: PostDetail },
    { path: "/mypage", view: MyPage },
  ];
  resolveRoute(routes);
};

const handleLinkClick = (event) => {
  const target = event.target;
  if (target.matches("[data-link]")) {
    event.preventDefault();
    updateUrlRoute(target.href);
  }
};

// body 전체 클릭에서 특정 태그로 이벤트 핸들러 개선
const setupEventListeners = () => {
  const app = document.querySelector("#app");
  const nav = document.querySelector(".nav");
  app.addEventListener("click", handleLinkClick);
  nav.addEventListener("click", handleLinkClick);

  window.addEventListener("popstate", getRouter);
};

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  getRouter();
});

import Home from "../views/Home.js";
import NotFound from "../views/NotFound.js";
import Posts from "../views/Posts.js";
import PostDetail from "../views/PostDetail.js";
import MyPage from "../views/MyPage.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getRouteParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const updateUrlRoute = (url) => {
  history.pushState(null, null, url);
  router();
};

const findMatchingRoute = (routes) => {
  const match = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });
  findRoute(match, routes);
};
const findRoute = (match, routes) => {
  let matchParams = match.find((params) => params.result !== null);
  if (!matchParams) {
    matchParams = {
      route: routes[0],
      result: ["/404"],
    };
  }
  renderView(matchParams);
};
const renderView = (match) => {
  const view = match.route.view();
  document.querySelector("#app").innerHTML = view;
};

const router = () => {
  const routes = [
    { path: "/404", view: NotFound },
    { path: "/", view: Home },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: PostDetail },
    { path: "/mypage", view: MyPage },
  ];
  findMatchingRoute(routes);
};

// popstate은 사용자가 브라우저의 뒤로 가기, 앞으로 가기 버튼 클릭했을때만 발생하는 이벤트
window.addEventListener("popstate", router);

const linkButtonClick = () => {
  document.body.addEventListener("click", (e) => {
    const matches = e.target.matches("[data-link]");
    if (!matches) return;
    e.preventDefault();
    updateUrlRoute(e.target.href);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  linkButtonClick();
  router();
});

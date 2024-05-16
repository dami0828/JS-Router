import Home from "../views/Home.js";
import NotFound from "../views/NotFound.js";
import Posts from "../views/Posts.js";
import PostDetail from "../views/PostDetail.js";
import MyPage from "../views/MyPage.js";

// :id 처럼 path로 오는 파라미터를 정규표현식으로 만든다.
// 이를 통해 동적 라우팅에서 매번 변화되는 path 파라미터 부분을 분리하기 위함
const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const updateUrlRoute = (url) => {
  history.pushState(null, null, url);
  router();
};

// url 일치하는 라우터를 새로운 배열로 만들어서 반환
const findMatchingRoute = (routes) => {
  const match = routes.map((route) => {
    return {
      route: route,
      // url이 정규식과 일치하는 전체 문자열을 첫 번째 요소로 포함하는 Array를 반환
      // [ "/posts/2", "2" ] 이 담긴다.
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });
  findRoute(match, routes);
};

// router에 담긴 배열들 중에서 일치하는 result만 찾아서 해당하는 view를 그려주기 위한 로직
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

const handleLinkClicks = () => {
  document.body.addEventListener("click", (e) => {
    const matches = e.target.matches("[data-link]");
    if (!matches) return;
    e.preventDefault();
    updateUrlRoute(e.target.href);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  handleLinkClicks();
  router();
});

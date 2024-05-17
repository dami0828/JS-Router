import Home from "./Home.js";
import Posts from "./Posts.js";
import MyPage from "./MyPage.js";
import NotFound from "./NotFound.js";
import PostDetail from "./PostDetail.js";

type Router = {
  path: string;
  view: () => string;
  result?: RegExpMatchArray | null;
};
const NOT_FOUND_ROUTE: Router = {
  path: "/404",
  view: NotFound,
};
const pathToRegex = (path: string) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const updateUrlRoute = (url: string) => {
  history.pushState(null, "", url);
  getRouter();
};

const resolveRoute = (routes: Router[]) => {
  const path: string = window.location.pathname;
  const matchedRoute: Router =
    routes.find((route) => path.match(pathToRegex(route.path))) ??
    NOT_FOUND_ROUTE;
  renderView(matchedRoute.view());
};

const renderView = (view: string) => {
  const appElement: HTMLElement | null = document.getElementById("app");
  if (appElement) appElement.innerHTML = view;
};

const getRouter = () => {
  const routes: Router[] = [
    { path: "/", view: Home },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: PostDetail },
    { path: "/mypage", view: MyPage },
  ];
  resolveRoute(routes);
};
const handleLinkClick = (event: MouseEvent) => {
  // const target = event.target as HTMLAnchorElement;
  // as 타입 단언을 사용하지 않고 타입 가드를 적용해서 타입을 검사해서 좀 더 안전하게 사용하기.
  if (
    event.target instanceof HTMLAnchorElement &&
    event.target.matches("[data-link]")
  ) {
    event.preventDefault();
    updateUrlRoute(event.target.href);
  }
};

// body 전체 클릭에서 특정 태그로 이벤트 핸들러 개선
const setupEventListeners = () => {
  const app = document.querySelector<HTMLElement>("#app");
  const nav = document.querySelector<HTMLElement>(".nav");

  // 여기서 document.querySelector<HTMLElement> 제네릭을 사용하여 해당 요소가 HTMLElement인지를 명시적으로 지정.
  // 이렇게 하면 반환되는 요소가 null이거나 HTMLElement임이 보장되며, null인 경우를 안전하게 처리할 수 있다.
  if (app && nav) {
    app.addEventListener("click", handleLinkClick);
    nav.addEventListener("click", handleLinkClick);
  }
  window.addEventListener("popstate", getRouter);
};

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  getRouter();
});

import Home from "./Home.js";
import Posts from "./Posts.js";
import MyPage from "./MyPage.js";
import NotFound from "./NotFound.js";
import PostDetail from "./PostDetail.js";
const NOT_FOUND_ROUTE = {
    path: "/404",
    view: NotFound,
};
const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
const updateUrlRoute = (url) => {
    history.pushState(null, "", url);
    getRouter();
};
const resolveRoute = (routes) => {
    const path = window.location.pathname;
    const matchedRoute = routes.find((route) => path.match(pathToRegex(route.path))) ??
        NOT_FOUND_ROUTE;
    renderView(matchedRoute.view());
};
const renderView = (view) => {
    const appElement = document.getElementById("app");
    if (appElement)
        appElement.innerHTML = view;
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
    if (event.target instanceof HTMLAnchorElement &&
        event.target.matches("[data-link]")) {
        event.preventDefault();
        updateUrlRoute(event.target.href);
    }
};
const setupEventListeners = () => {
    const app = document.querySelector("#app");
    const nav = document.querySelector(".nav");
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

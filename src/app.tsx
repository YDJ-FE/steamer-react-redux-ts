/**
 * app.js
 *
 * 程序的入口
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import configureStore from "./configureStore";


// 如果依赖第三方UI库的样式，建议去掉sanitize.css的依赖
import "sanitize.css/sanitize.css";

/**
 * 这里开始你的第三方包依赖，包括css
 * Example
 *
 * import "antd/dist/antd.css"
 */

 // import mobile website layout units
import 'vw-layout'

// app global style
import './app.scss'

// Import root app
import App from "containers/shared/App";

// 如果用brwoserHistory方式的话服务器需要配合设置
// import createHistory from 'history/createBrowserHistory'
import createHistory from "history/createHashHistory";




const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById("root");

const render = (Component) => {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Component />
            </ConnectedRouter>
        </Provider>,
        MOUNT_NODE
    );
};

render(App)

if (module.hot) {
    // 热更新React Components
    // module.hot.accept不支持动态的依赖
    // 必须是编译时定义的常量
    module.hot.accept(["containers/shared/App"], () => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render(require('containers/shared/App').default);
    });
}

// TODO: 待验证
// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === "production") {
    // tslint:disable-next-line:no-var-requires
    require("offline-plugin/runtime").install(); // eslint-disable-line global-require
}

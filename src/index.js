import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import jobReducers from "./store/job-reducers";
import companyReducers from "./store/company-reducers";
import applicantReducers from "./store/applicant-reducers";

const rootReducers = combineReducers({
  job: jobReducers,
  company: companyReducers,
  applicant: applicantReducers,
});

const store = createStore(rootReducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import Main from "./components/Main";
import React from "react";
import ReactDOM from "react-dom";
// import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

window.React = React;
ReactDOM.render(<Main />, document.getElementById("root"));

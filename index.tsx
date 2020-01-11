import * as React from "react";
import * as ReactDOM from "react-dom";

const App = () => {
  return <div>test app</div>;
};

const div = document.createElement("div");
document.body.appendChild(div);

console.log(React);

window.onload = () => {
  ReactDOM.render(<App></App>, div);
};

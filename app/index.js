import React from "react";
import ReactDOM from "react-dom";

import TodoModel from "./todoModel";
import TodoApp from "./todoApp";

let model = new TodoModel("react-todos");

let render = () => {
  ReactDOM.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName("todoapp")[0]
  )
};

model.subscribe(render);
render()
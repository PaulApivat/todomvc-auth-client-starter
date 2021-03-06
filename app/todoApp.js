// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/app.jsx

import React, { Component } from "react";
import {
  ReactiveBase,
  ReactiveList,
  TextField,
  DataController
} from "@appbaseio/reactivesearch";

import Utils from "./utils";
import TodoList from "./todoList";

import "./todomvc.scss";
import "./style.scss";

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;
const ALL_TODOS = "all";
const ACTIVE_TODOS = "active";
const COMPLETED_TODOS = "completed";

class TodoApp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      newTodo: ""
    }
    this.onAllData = this.onAllData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
  }

  handleChange (newTodo) {
    this.setState({ newTodo })
  }

  handleNewTodoKeyDown (event) {
    if (event.keyCode !== ENTER_KEY) {
      return
    }
    event.preventDefault();
    const val = this.state.newTodo.trim();
    if (val) {
      this.props.model.addTodo(val);
      this.setState({newTodo: ""})
    }
  }

  toggleAll (event) {
    let checked = event.target.checked;
    this.props.model.toggleAll(checked)
  }

  customQuery(value) {
    return {
      query: {
        match_all: {}
      }
    };
  }

  onAllData(data) {
    
    // merging all streaming and historic data
    let todosData = Utils.mergeTodos(data);

    // sorting todos based on creation time
    todosData = todosData.sort(function(a, b) {
      return a._source.createdAt - b._source.createdAt;
    });
    console.log(todosData)

    return (
      <TodoList
        todos={todosData}
        model={this.props.model}
      />
    )
  }

  render () {
    let todos = this.props.model.todos;

    let { nowShowing, newTodo } = this.state;

    let activeTodoCount = todos.reduce((accum, todo) => {
      return todo.completed ? accum : accum + 1
    }, 0);

    return (
      <ReactiveBase
        app="todomvc-auth"
        credentials="pVPf3rRLj:61fd73c0-3660-44db-8309-77d9d35d64cc"
        type="todo_reactjs"
      >
        <DataController
          componentId="AllTodosSensor"
          visible={false}
          showFilter={false}
          customQuery={
            function(value) {
              return {
                match_all: {}
              }
            }
          }
        />
        <header className="header">
          <h1>todos</h1>
          <TextField
            componentId="NewTodoSensor"
            dataField="title"
            className="new-todo-container"
            placeholder="What needs to be done?"
            onKeyDown={this.handleNewTodoKeyDown}
            onValueChange={this.handleChange}
            defaultSelected={newTodo}
            autoFocus={true}
          />
        </header>

        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            <ReactiveList
              stream={true}
              react={{
                or: ["AllTodosSensor"]
              }}
              scrollOnTarget={window}
              showResultStats={false}
              pagination={false}
              onAllData={this.onAllData}
            />
          </ul>
        </section>
      </ReactiveBase>
      )
    }
  }

  export default TodoApp;
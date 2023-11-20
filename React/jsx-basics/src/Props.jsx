import React from "react";

export function Props() {
  return (
    <div>
      <InfoTile name={"Atulya"} alive={false}>
        <span>Hehehe</span>
      </InfoTile>
      <InfoTile name={"Manus"} age={12} alive>
        <span>Ahahaha</span>
      </InfoTile>
      <InfoTile name={"Topi"} age={213} alive>
        <span>HOHOHO</span>
      </InfoTile>
      <InfoTileProps name={"Atulya"} alive={false}>
        <span>Hehehe</span>
      </InfoTileProps>
    </div>
  );
}

function InfoTile({ name, age = 32, alive, children }) {
  return (
    <div>
      <span>Name: {name}, </span>
      <span>Age: {age}, </span>
      <span>Is alive: {"" + alive}, </span>
      <span>Children: {children} </span>
    </div>
  );
}

function InfoTileProps(props) {
  return (
    <div>
      <span>Name: {props.name}, </span>
      <span>Age: {props.age}, </span>
      <span>Is alive: {"" + props.alive}, </span>
      <span>Children: {props.children} </span>

      <TodoListItem isComplete>Shit</TodoListItem>
      <TodoListItem isComplete>Eat</TodoListItem>
      <TodoListItem isComplete>Die</TodoListItem>
      <TodoListItemClass isComplete>AAAAAAHHHHHH</TodoListItemClass>
    </div>
  );
}

function TodoListItem({ children, isComplete }) {
  return (
    <div>
      <label>
        <input type="checkbox" defaultChecked={isComplete} />
        {children}
      </label>
    </div>
  );
}

class TodoListItemClass extends React.Component {
  render() {
    return (
      <div>
        <label>
          <input type="checkbox" defaultChecked={this.props.isComplete} />
          {this.props.children}
        </label>
      </div>
    );
  }
}

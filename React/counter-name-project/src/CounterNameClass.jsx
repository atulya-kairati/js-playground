import React from "react";

export class CounterNameClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "ddd",
      age: 0,
    };
  }

  // lifecycle methods
  componentDidMount(){
    console.log("Component mounted");
  }

  componentDidUpdate(prevProps, prevState){
    console.log("Component updated", prevProps, prevState);

    if (prevState.age !== this.state.age) {
      console.log("Age changed");
    }
  }

  componentWillUnmount(){
    console.log("Component unmounted");
  }

  render() {
    return (
      <>
        <input
          type="test"
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
        />
        <br />
        <br />
        <button
          onClick={() => {
            this.setState({ age: this.state.age - 1 });
          }}
        >
          -
        </button>
        <span style={{ padding: 10 }}>{this.state.age}</span>
        <button
          onClick={() => {
            this.setState({ age: this.state.age + 1 });
          }}
        >
          +
        </button>
        <br />
        <br />
        <div>
          My name is {this.state.name}. I am {this.state.age} years old.
        </div>
      </>
    );
  }
}

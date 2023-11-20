import React from "react";

export class CounterClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1,
    };
  }

  render() {
    const increment = () => {
      this.setState({ count: this.state.count + 1 });
    };

    return (
      <>
        <div>count: {this.state.count}</div>
        <button style={{ fontSize: 32 }} onClick={increment}>
          +1
        </button>
      </>
    );
  }
}

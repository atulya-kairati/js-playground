import { useState } from "react";
import { Counter } from "./Counter";
import { CounterClass } from "./CounterClass";

function App() {
  const [name, setName] = useState("Mememe");

  function onNameChange(newName, j) {
    setName(newName.target.value);
  }

  return (
    <>
      <Counter />
      <br></br>
      <br></br>
      <div>{name}</div>
      <input type="text" onChange={onNameChange} value={name} />
      <br></br>
      <br></br>
      <CounterClass />
    </>
  );
}

export default App;

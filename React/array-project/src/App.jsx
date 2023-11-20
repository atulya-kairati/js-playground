import { useState } from "react";
import "./styles.css";

const initArray = ["a", "b", "c"];

function App() {
  const [array, setArray] = useState(initArray);
  const [input, setInput] = useState("");
  const [index, setIndex] = useState(0);

  function popFirst() {
    setArray((arr) => arr.slice(1));
  }

  return (
    <>
      <div>{array.join(", ")}</div>
      <button onClick={popFirst}>Pop First</button>
      <button onClick={() => setArray([])}>Clear</button>
      <button onClick={() => setArray(initArray)}>Reset</button>
      <br />
      <br />
      <label>Char: </label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <label>Index: </label>
      <input
        type="number"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
      />
      <br />
      <button onClick={() => setArray(array.filter((e) => e != input))}>
        Remove "{input}"
      </button>
      <button onClick={() => setArray([input, ...array])}>
        Add "{input}" at start
      </button>
      <button onClick={() => setArray([...array, input])}>
        Add "{input}" at end
      </button>
      <br />
      <button
        onClick={() =>
          setArray([...array.slice(0, index), input, ...array.slice(index)])
        }
      >
        Add "{input}" at {index}
      </button>

      <button onClick={() => setArray(array.map(e => e === 'A' ? 'H' : e))} >All A's to H</button>
    </>
  );
}

export default App;

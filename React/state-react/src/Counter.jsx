import { useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);
  
    function increment() {
    //   setCount(count + 1)
      setCount((c) => c+1)
      // setCount((c) => c+1)
    }
  
    return (
      <>
        <div>count: {count}</div>
        <button style={{ fontSize: 32 }} onClick={increment}>+1</button>
      </>
    );
}
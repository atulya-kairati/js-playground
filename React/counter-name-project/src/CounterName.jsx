import { useEffect, useState } from "react";

export function CounterName() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  // run on every render
  useEffect(() => {
    console.log("Re-render");
  });

  // runs olnly when the component is mounted
  useEffect(() => {
    console.log("Component mounted");
  }, []);

  useEffect(() => {
    return () => console.log("Component unmounted");
  }, []);

  // runs everytime age changes
  useEffect(() => {
    console.log("Age Changed");
  }, [age]);

  // returned function is run for clean up
  useEffect(() => {
    const handler = () => {
      console.log("Clicked");
    };

    document.title = name;

    document.addEventListener("click", handler);

    // to cleanup any dangling listeners when the component is unmounted
    return () => {
      document.removeEventListener("click", handler);
      console.log("clean up");
    };
  }, [name]);

  useEffect(() => {
    console.log(name, age);
  }, [name, age]);

  // print finalized name after 1 sec
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      console.log(`My name is ${name}`);
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [name]);

  return (
    <>
      <input
        type="test"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />
      <button
        onClick={() => {
          setAge((age) => age - 1);
        }}
      >
        -
      </button>
      <span style={{ padding: 10 }}>{age}</span>
      <button
        onClick={() => {
          setAge((age) => age + 1);
        }}
      >
        +
      </button>
      <br />
      <br />
      <div>
        My name is {name}. I am {age} years old.
      </div>
    </>
  );
}

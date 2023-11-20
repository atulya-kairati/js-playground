import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const abortController = new AbortController();

    getApiData(abortController.signal)
      .then((j) => {
        setData(j);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();

      setLoading(true);
      setError(undefined);
      setData(undefined);
    };
  }, []);

  // console.log(data);

  return (
    <>
      {loading && <h1>Loading...</h1>}
      {error && <div>{"" + error}</div>}
      <div>{JSON.stringify(data)}</div>
    </>
  );
}

export default App;

async function getApiData(signal) {
  try {
    const resp = await fetch("https://jsonplaceholder.typicode.com/users", {
      signal: signal,
    });

    if (!resp.ok) {
      return Promise.reject(`Request error: ${resp.status}`);
    }

    return await resp.json();
  } catch (error) {
    return Promise.reject(error);

    console.log(error == "AbortError");
  }
}

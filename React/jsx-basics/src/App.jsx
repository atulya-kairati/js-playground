import React, { useState } from "react";

function App() {
  /**
   * HTML attributes in JSX are in camelcase
   * only "data" and "aria" attributes use '-'
   *
   *
   * HTML   |    JSX
   * class  | className in JSX
   * for    | htmlFor
   *
   *
   * Anything enlcosed by "{}" in JSX is treated
   * as js code. We insert js using this
   *
   * style to element is passed as objects instead of strings
   * Ex: style={{ backgroundColor: "red" }}
   * First {} is to include JS code and second is the object itself
   *
   * JSX elements always need to be closed.
   * Self closed if no children and a seperate closing tag if children
   * 
   * Only return one entity
   * 
   * undefined, null, false dont render in JSX
   * 
   * JSX elements can be stored in variables and used in JSX using {}
   */

  const myBye = <h1>Bye!</h1>

  return (
    <div>
      <h1 id="h" style={{ backgroundColor: "red" }}>
        Hii <span>there</span>
        <input id="hed" type="text" value={"manus"} />
        <label htmlFor="hed">{4 * 3}</label>
      </h1>

      <div id="largeDiv" className="large">
        <label htmlFor="inputId">Enter num</label>
        <input id="inputId" type="number" value={3}/>
      </div>

      {myBye}
    </div>
  );

  // same as (This is what JSX gets converted to internally)
  return React.createElement(
    "h1", // type
    { id: "5" }, // props
    "Hiii ", // child
    React.createElement("span", {}, "there") // another child
  );
}

export default App;

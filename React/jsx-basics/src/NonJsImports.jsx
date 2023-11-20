import "./assets/styles.css";
import junk from "./assets/junk.json";
import img from "./assets/code.png";

export function NonJsImports() {
  return (
    <div>
      <h1>My code</h1>
      <div>{JSON.stringify(junk)}</div>
      <img src={img} />
    </div>
  );
}

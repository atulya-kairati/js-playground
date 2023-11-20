import { Card } from "./Card"
import user from "./assets/user.json"
import "./assets/user.css"

function App() {

  return (
    <Card name={user.name} age={user.age} phoneNumber={user.phoneNumber} address={user.address}/>
  )
}

export default App



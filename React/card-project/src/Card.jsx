export function Card({ name, age, address, phoneNumber }) {
  return (
    <div className="card">
      <CardTitle title={name} />
      <div className="body">
        <CardLabel title={"Age: "} value={age} />
        <CardLabel title={"Phone No: "} value={phoneNumber} />
        <CardLabel title={"address: "} value={address} />
      </div>
    </div>
  );
}

function CardTitle({ title }) {
  return <h2 className="name">{title}</h2>;
}

function CardLabel({ title, value }) {
  return (
    <>
      <div className="label">{title}</div>
      <div>{value}</div>
    </>
  );
}

import data from "~/models/client";
import { useParams } from "react-router";
import { Link } from "@remix-run/react";
const ClientDetails = () => {
  const { clientId } = useParams();
  const client = data.find((client) => client.id === clientId);

  return (
    <div>
      <Link to="/clients">close</Link>
      <img src={client.avatar} alt="" />
      <h2>{client.name}</h2>
      <p>{client.title}</p>
      <p>{client.quote}</p>
      <p>nationality: {client.nationality}</p>
    </div>
  );
};

export default ClientDetails;

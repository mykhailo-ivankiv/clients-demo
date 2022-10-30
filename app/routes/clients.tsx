import type { FC } from "react";
import { Form, Outlet, Link } from "@remix-run/react";
import data from "~/models/client";
import { useParams } from "react-router";
const Client: FC<{
  id: string;
  isActive: boolean;
  name: string;
  avatarUrl: string;
}> = ({ id, isActive, name, avatarUrl }) => (
  <Link
    to={`./${id}`}
    className={`flex items-center gap-2 p-1 ${isActive ? "bg-gray-100" : ""}`}
  >
    <img className="h-8 w-8" src={avatarUrl} alt="" />
    <span
      className="text-indigo-600"
      dangerouslySetInnerHTML={{ __html: name }}
    />
  </Link>
);
const Clients = () => {
  const { clientId } = useParams();
  return (
    <main className="mx-auto  flex max-w-[960px] justify-items-stretch gap-2 p-4">
      <Form
        action={clientId ? `/clients/${clientId}` : "/clients"}
        className="w-80 "
      >
        <div className="mb-4 flex gap-1">
          <input
            placeholder="e.g. Brendon Taylor"
            className="flex-1  border-2 px-2"
            type="text"
            name="search"
          />
          <button className="rounded-md bg-gray-900 px-3 text-white">
            Search
          </button>
        </div>

        {data.map(({ id, name, avatar }) => (
          <Client
            isActive={clientId === id}
            id={id}
            name={name}
            avatarUrl={avatar}
          />
        ))}
      </Form>
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default Clients;

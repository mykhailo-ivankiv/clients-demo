import { useLoaderData, useCatch } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import type { Client } from "@prisma/client";

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getFullCountyNameFromCode(countryCode: string) {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode);
}

type LoaderData = {
  client: Client;
};

export async function loader({ params }: LoaderArgs) {
  invariant(params.clientSlug, "noteId not found");

  const client = await prisma.client.findUnique({
    where: { slug: params.clientSlug },
  });

  if (!client) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ client });
}

export default function ClientDetails() {
  const { client } = useLoaderData<LoaderData>();

  return (
    <div>
      <img
        className="h-[264px] w-[280px] rounded-full object-contain"
        src={client.avatar}
        alt=""
      />
      <h2>{client.name}</h2>
      <p>{client.title}</p>
      {client.quote && (
        <blockquote
          className="
            relative
            m-4
            pl-2
            before:absolute
            before:top-[-0.5em]
            before:left-[-0.7em]
            before:text-xl
            before:content-['❝']
          "
        >
          {client.quote}
        </blockquote>
      )}
      {client.nationality && (
        <p>
          Nationality: {getFlagEmoji(client.nationality)}{" "}
          {getFullCountyNameFromCode(client.nationality)}
        </p>
      )}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Client not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

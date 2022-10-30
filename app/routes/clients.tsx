import {
  Form,
  Outlet,
  Link,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useParams } from "react-router";
import { prisma } from "~/db.server";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Client } from "@prisma/client";
import SearchHighlight, {
  SearchHighlightContext,
} from "~/components/SearchHighlight";

type LoaderData = {
  clients: Client[];
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  return json<LoaderData>({
    clients: await prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { title: { contains: query } },
          { quote: { contains: query } },
        ],
      },
    }),
  });
}

export default function Clients() {
  const { clientSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { clients } = useLoaderData<LoaderData>();

  const query = searchParams.get("q") || "";

  return (
    <main className="mx-auto  flex max-w-[960px] justify-items-stretch gap-2 p-4">
      <Form
        action={clientSlug ? `/clients/${clientSlug}` : "/clients"}
        className="w-80 "
      >
        <div className="mb-4 flex gap-1">
          <input
            placeholder="e.g. Brendon Taylor"
            className="flex-1  border-2 px-2"
            type="text"
            name="q"
          />
          <button className="rounded-md bg-gray-900 px-3 text-white">
            Search
          </button>
        </div>

        {clients.length === 0 && (
          <div>No clients found try to change query</div>
        )}

        <SearchHighlightContext.Provider value={[query]}>
          {clients.map(({ slug, name, avatar, title, quote }) => (
            <Link
              key={slug}
              to={`./${slug}`}
              className={`flex items-center gap-2 p-1 ${
                clientSlug === slug ? "bg-gray-100" : ""
              }`}
            >
              <img className="h-8 w-8" src={avatar} alt="" />
              <div>
                <span className="text-indigo-600">
                  <SearchHighlight text={name} />
                </span>

                {query && title && title.indexOf(query) >= 0 && (
                  <div className="text-sm">
                    <SearchHighlight text={title} />
                  </div>
                )}

                {query && quote && quote.indexOf(query) >= 0 && (
                  <div className="text-sm">
                    <SearchHighlight text={quote} />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </SearchHighlightContext.Provider>
      </Form>
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}

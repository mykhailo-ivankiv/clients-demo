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
import InputQueryClients from "~/components/InputQueryClients";
import { getDataFromQuery } from "~/utils/queryParser";
import { includes, trim } from "ramda";
import { useMemo } from "react";
import {
  getCountryCodeFromName,
  getCountryNameFromCode,
} from "~/utils/location";

type LoaderData = {
  clients: Client[];
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() || "";

  const data = getDataFromQuery(query);

  const where =
    data.length !== 0
      ? {
          OR: data.map((item) => ({
            AND: Object.entries(item).flatMap(([key, value]) => {
              switch (key) {
                case "q":
                  return {
                    OR: [
                      { name: { contains: value } },
                      { title: { contains: value } },
                      { quote: { contains: value } },
                    ],
                  };
                case "name":
                  return { name: { contains: value } };
                case "quote":
                  return { quote: { contains: value } };
                case "title":
                  return { title: { contains: value } };
                case "nationality":
                  return {
                    OR: value
                      .split(",")
                      .map(trim)
                      .map(getCountryCodeFromName)
                      .filter((a) => a)
                      .map((countryCode) => ({
                        nationality: { equals: countryCode },
                      })),
                  };
                default:
                  return {};
              }
            }),
          })),
        }
      : undefined;

  return json<LoaderData>({
    clients: await prisma.client.findMany({
      where,
      take: 10,
    }),
  });
}

function ClientItem({
  slug,
  name,
  avatar,
  title,
  quote,
  nationality,
}: {
  slug: string;
  name: string;
  avatar: string;
  title: string | null;
  quote: string | null;
  nationality: string | null;
}) {
  const { clientSlug } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() || "";

  const parsedQuery = useMemo(
    () =>
      getDataFromQuery(query)
        .map(Object.entries)
        .flat()
        .flatMap((pair: [string, string]) =>
          pair[0] === "q"
            ? [
                ["name", pair[1]],
                ["title", pair[1]],
                ["quote", pair[1]],
              ]
            : [pair]
        )
        .reduce<Record<string, string[]>>((acc, [key, value]) => {
          if (key === "nationality") {
            const nationalities = value
              .split(",")
              .map(trim)
              .map(getCountryCodeFromName)
              .filter((countryCode) => countryCode !== undefined) as string[];

            if (acc[key]) acc[key].push(...nationalities);
            else acc[key] = nationalities;

            return acc;
          }

          if (acc[key]) acc[key].push(value);
          else acc[key] = [value];

          return acc;
        }, {}),
    [query]
  );

  return (
    <Link
      to={`./${slug}?${searchParams}`}
      className={`flex items-center gap-2 p-1 ${
        clientSlug === slug ? "bg-gray-100" : ""
      }`}
    >
      <img
        className="aspect-square h-8 rounded-full object-contain"
        src={avatar}
        alt=""
      />
      <div>
        <SearchHighlightContext.Provider value={parsedQuery.name || []}>
          <h4 className="text-indigo-600">
            <SearchHighlight text={name} />
          </h4>
        </SearchHighlightContext.Provider>

        {title &&
          parsedQuery.title?.some((query: string) =>
            includes(query, title.toLowerCase())
          ) && (
            <SearchHighlightContext.Provider value={parsedQuery.title || []}>
              <dl className="flex gap-1 text-xs">
                <dt className="text-gray-400">title:</dt>
                <dd className="">
                  <SearchHighlight text={title} />
                </dd>
              </dl>
            </SearchHighlightContext.Provider>
          )}

        {quote &&
          parsedQuery.quote?.some((query: string) =>
            includes(query, quote.toLowerCase())
          ) && (
            <SearchHighlightContext.Provider value={parsedQuery.quote || []}>
              <dl className="flex gap-1 text-xs">
                <dt className="text-gray-400">quote:</dt>
                <dd>
                  <SearchHighlight text={quote} />
                </dd>
              </dl>
            </SearchHighlightContext.Provider>
          )}

        {nationality &&
          parsedQuery.nationality?.some(
            (countryCode: string) => countryCode === nationality
          ) && (
            <dl className="flex gap-1 text-xs">
              <dt className="text-gray-400">nationality:</dt>
              <dd>
                <span className="bg-yellow-100">
                  {getCountryNameFromCode(nationality)}
                </span>
              </dd>
            </dl>
          )}
      </div>
    </Link>
  );
}

export default function Clients() {
  const { clientSlug } = useParams();
  const { clients } = useLoaderData<LoaderData>();

  return (
    <main className="mx-auto min-w-[375px] max-w-[600px] px-2">
      <Form
        action={clientSlug ? `/clients/${clientSlug}` : "/clients"}
        className="w-full"
      >
        <div className="sticky top-0 z-10 mb-1 bg-white py-2">
          <InputQueryClients name="q" />
        </div>

        <div className="min-h-16 flex">
          <div className="w-[50%] min-w-[12rem] border-r border-gray-200 pr-2">
            {clients.length === 0 && (
              <div className="m-4 font-bold text-gray-400">
                Nothing found try another query
              </div>
            )}

            <div className="flex flex-col gap-1">
              {clients.map(
                ({ slug, name, avatar, title, quote, nationality }) => (
                  <ClientItem
                    key={slug}
                    name={name}
                    slug={slug}
                    avatar={avatar}
                    title={title}
                    quote={quote}
                    nationality={nationality}
                  />
                )
              )}
            </div>
          </div>

          <div className="ml-2 w-[50%] min-w-[10rem]">
            <Outlet />
          </div>
        </div>
      </Form>
    </main>
  );
}

import type { Client } from '@prisma/client'
import { useParams } from 'react-router'
import { useSearchParams, Link } from '@remix-run/react'
import { useMemo } from 'react'
import { getSearchParamsFromQueryString } from '~/utils/queryParser'
import { includes } from 'ramda'
import { getCountryNameFromCode } from '~/utils/location'
import SearchHighlight, { SearchHighlightContext } from '~/components/SearchHighlight'

export default function ClientItem({ client }: { client: Client }) {
  const { slug, name, avatar, title, quote, nationality } = client

  const { clientSlug } = useParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim().toLowerCase() || ''

  const parsedQuery = useMemo(() => getSearchParamsFromQueryString(query), [query])

  return (
    <Link
      to={`./${slug}?${searchParams}`}
      className={`flex items-center gap-2 p-1 ${clientSlug === slug ? 'bg-gray-100' : ''}`}
    >
      <img className="aspect-square h-8 rounded-full object-contain" src={avatar} alt="" />
      <div>
        <SearchHighlightContext.Provider value={parsedQuery.name || []}>
          <h4 className="text-indigo-600">
            <SearchHighlight text={name} />
          </h4>
        </SearchHighlightContext.Provider>

        <SearchHighlightContext.Provider value={parsedQuery.title || []}>
          <div className="flex gap-1 text-xs">
            <SearchHighlight text={title || ''} />
          </div>
        </SearchHighlightContext.Provider>

        {quote && parsedQuery.quote?.some((query: string) => includes(query, quote.toLowerCase())) && (
          <SearchHighlightContext.Provider value={parsedQuery.quote || []}>
            <dl className="flex gap-1 text-xs">
              <dt className="text-gray-400">quote:</dt>
              <dd>
                <SearchHighlight text={quote} />
              </dd>
            </dl>
          </SearchHighlightContext.Provider>
        )}

        {nationality && parsedQuery.nationality?.some((countryCode: string) => countryCode === nationality) && (
          <dl className="flex gap-1 text-xs">
            <dt className="text-gray-400">nationality:</dt>
            <dd>
              <span className="bg-yellow-100">{getCountryNameFromCode(nationality)}</span>
            </dd>
          </dl>
        )}
      </div>
    </Link>
  )
}

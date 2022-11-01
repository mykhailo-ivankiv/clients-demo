import React from 'react'
import {
  many,
  anyCharExcept,
  sequenceOf,
  choice,
  endOfInput,
  char,
  str,
  whitespace,
  startOfInput,
  sepBy,
} from 'arcsecond'
import { identity, reduce, reject, pipe, last, isEmpty, map, trim, intersperse } from 'ramda'
import { getCountryCodeFromName } from '~/utils/location'

const getQueryParser = (
  mapper: Partial<{
    mapKeyword: (keyword: string) => any
    mapKeywordWrapper: ([start, keyword, end]: [string | null, string, string | null]) => unknown
    mapQuery: (query: unknown[]) => unknown
    mapQueries: (queries: unknown[]) => unknown
  }>,
) => {
  //Mappers
  const mapKeyword = mapper?.mapKeyword ?? identity
  const mapKeywordWrapper = mapper?.mapKeywordWrapper ?? identity
  const mapQuery = mapper?.mapQuery ?? identity
  const mapQueries = mapper?.mapQueries ?? identity

  const separator = char(';')

  const nameKeyWord = str(':name')
  const titleKeyWord = str(':title')
  const quoteKeyWord = str(':quote')
  const nationalityKeyWord = str(':nationality')

  const keyword = choice([nameKeyWord, titleKeyWord, quoteKeyWord, nationalityKeyWord]).map(mapKeyword)

  const startOrWhitespace = choice([whitespace, startOfInput])
  const endOrWhitespace = choice([whitespace, endOfInput])

  const keywordWrapper = sequenceOf([startOrWhitespace, keyword, endOrWhitespace]).map(mapKeywordWrapper)

  const query = many(choice([keywordWrapper, anyCharExcept(separator)])).map(mapQuery)

  return sepBy(char(';'))(query).map(mapQueries)
}

const parseQueryToData = getQueryParser({
  mapKeyword: (keyword) => keyword.slice(1),
  mapKeywordWrapper: ([_start, keyword, _end]) => keyword,
  // @ts-ignore
  mapQuery: pipe<
    [string[]],
    [string, Record<string, string>],
    Record<string, string>,
    Record<string, string>,
    Record<string, string>
  >(
    reduce<string, [string, Record<string, string>]>(
      ([key, data], keywordOrChar) => {
        if (keywordOrChar.length !== 1) {
          // overwrite the previous key
          // example: ":name John :name Doe" => { name: "Doe" }
          data[keywordOrChar] = ''
          return [keywordOrChar, data]
        }

        return [key, { ...data, [key]: (data[key] ?? '') + keywordOrChar }]
      },
      ['q', { q: '' }],
    ),
    last,
    // @ts-ignore
    map(trim),
    reject(isEmpty),
  ),
  mapQueries: reject(isEmpty),
})

const parseQueryToReact = getQueryParser({
  // @ts-ignore
  mapQueries: intersperse(<span className="text-orange-500">;</span>),
  mapKeyword: (keyword) => <span className="text-sky-500">{keyword}</span>,
})

export const getDataFromQuery = (query: string) =>
  // @ts-ignore
  parseQueryToData.run(query).result as Partial<{
    q: string
    name: string
    title: string
    quote: string
  }>[]

// @ts-ignore
export const getReactComponentsFromQuery = (query: string) => parseQueryToReact.run(query).result

export const getPrismaFilterQueryFromString = (query: string) => {
  const data = getDataFromQuery(query)

  return data.length !== 0
    ? {
        OR: data.map((item) => ({
          AND: Object.entries(item).flatMap(([key, value]) => {
            switch (key) {
              case 'q':
                return {
                  OR: [{ name: { contains: value } }, { title: { contains: value } }, { quote: { contains: value } }],
                }
              case 'name':
                return { name: { contains: value } }
              case 'quote':
                return { quote: { contains: value } }
              case 'title':
                return { title: { contains: value } }
              case 'nationality':
                return {
                  OR: value
                    .split(',')
                    .map(trim)
                    .map(getCountryCodeFromName)
                    .filter((a) => a)
                    .map((countryCode) => ({
                      nationality: { equals: countryCode },
                    })),
                }
              default:
                return {}
            }
          }),
        })),
      }
    : undefined
}

export const getSearchParamsFromQueryString = (
  query: string,
): Partial<{ name: string[]; title: string[]; quote: string[]; nationality: string[] }> =>
  getDataFromQuery(query)
    .map(Object.entries)
    .flat()
    .flatMap((pair: [string, string]) =>
      pair[0] === 'q'
        ? [
            ['name', pair[1]],
            ['title', pair[1]],
            ['quote', pair[1]],
          ]
        : [pair],
    )
    .reduce<Record<string, string[]>>((acc, [key, value]) => {
      if (key === 'nationality') {
        const nationalities = value
          .split(',')
          .map(trim)
          .map(getCountryCodeFromName)
          .filter((countryCode) => countryCode !== undefined) as string[]

        if (acc[key]) acc[key].push(...nationalities)
        else acc[key] = nationalities

        return acc
      }

      if (acc[key]) acc[key].push(value)
      else acc[key] = [value]

      return acc
    }, {})

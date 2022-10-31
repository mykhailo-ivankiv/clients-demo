import React from "react";
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
} from "arcsecond";
import {
  identity,
  reduce,
  reject,
  pipe,
  last,
  isEmpty,
  map,
  trim,
  intersperse,
} from "ramda";

const getQueryParser = (
  mapper: Partial<{
    mapKeyword: (keyword: string) => any;
    mapKeywordWrapper: ([start, keyword, end]: [
      string | null,
      string,
      string | null
    ]) => unknown;
    mapQuery: (query: unknown[]) => unknown;
    mapQueries: (queries: unknown[]) => unknown;
  }>
) => {
  //Mappers
  const mapKeyword = mapper?.mapKeyword ?? identity;
  const mapKeywordWrapper = mapper?.mapKeywordWrapper ?? identity;
  const mapQuery = mapper?.mapQuery ?? identity;
  const mapQueries = mapper?.mapQueries ?? identity;

  const separator = char(";");

  const nameKeyWord = str(":name");
  const titleKeyWord = str(":title");
  const quoteKeyWord = str(":quote");

  const keyword = choice([nameKeyWord, titleKeyWord, quoteKeyWord]).map(
    mapKeyword
  );

  const startOrWhitespace = choice([whitespace, startOfInput]);
  const endOrWhitespace = choice([whitespace, endOfInput]);

  const keywordWrapper = sequenceOf([
    startOrWhitespace,
    keyword,
    endOrWhitespace,
  ]).map(mapKeywordWrapper);

  const query = many(choice([keywordWrapper, anyCharExcept(separator)])).map(
    mapQuery
  );

  return sepBy(char(";"))(query).map(mapQueries);
};

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
          data[keywordOrChar] = "";
          return [keywordOrChar, data];
        }

        return [key, { ...data, [key]: (data[key] ?? "") + keywordOrChar }];
      },
      ["q", { q: "" }]
    ),
    last,
    // @ts-ignore
    map(trim),
    reject(isEmpty)
  ),
  mapQueries: reject(isEmpty),
});

const parseQueryToReact = getQueryParser({
  // @ts-ignore
  mapQueries: intersperse(<span className="text-sky-300">;</span>),
  mapKeyword: (keyword) => <span className="text-sky-500">{keyword}</span>,
});

export const getDataFromQuery = (query: string) =>
  // @ts-ignore
  parseQueryToData.run(query).result as Partial<{
    q: string;
    name: string;
    title: string;
    quote: string;
  }>[];
export const getReactComponentsFromQuery = (query: string) =>
  // @ts-ignore
  parseQueryToReact.run(query).result;

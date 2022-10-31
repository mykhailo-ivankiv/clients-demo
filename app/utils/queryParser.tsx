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

const getQueryParser = (mapper?: Record<string, Function>) => {
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

export const parseQueryToData = getQueryParser({
  mapKeyword: (keyword) => keyword.slice(1),
  mapKeywordWrapper: ([_start, keyword, _end]) => keyword,
  mapQuery: pipe(
    reduce<string, [string, object]>(
      ([key, data], keywordOrChar) => {
        if (keywordOrChar.length !== 1) {
          // overwrite the previous key
          // example: ":name John :name Doe" => { name: "Doe" }
          data[keywordOrChar] = "";
          return [keywordOrChar, data];
        }

        return [key, { ...data, [key]: data[key] + keywordOrChar }];
      },
      ["q", { q: "" }]
    ),
    last,
    map(trim),
    reject(isEmpty)
  ),
  mapQueries: reject(isEmpty),
});

export const parseQueryToReact = getQueryParser({
  mapQueries: intersperse(<span className="text-yellow-500">;</span>),
  mapKeyword: (keyword) => <span className="text-green-500">{keyword}</span>,
});

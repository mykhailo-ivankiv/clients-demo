import { useContext, createContext } from "react";
import { splitAt } from "ramda";
import { getSubstringEntriesIndices } from "~/utils/string";

export const SearchHighlightContext = createContext([""]);

export default function SearchHighlight({ text }: { text: string }) {
  const searchQueries = useContext(SearchHighlightContext);
  const substringEntriesIndices = searchQueries
    .flatMap((searchQuery) => getSubstringEntriesIndices(text, searchQuery))
    .sort();

  if (searchQueries[0] === "" && substringEntriesIndices.length === 0) {
    return <>{text}</>;
  } else {
    return (
      <>
        {substringEntriesIndices
          .reduce<[string[], number]>(
            ([result, offset], index) => {
              const last = result.pop();
              const [prefix, partWithSearchQueryAtStart] = splitAt(
                index - offset,
                last as string
              );
              const [query, suffix] = splitAt(
                searchQueries.find((searchQuery) =>
                  partWithSearchQueryAtStart
                    .toLowerCase()
                    .startsWith(searchQuery.toLowerCase())
                )?.length ?? 0,
                partWithSearchQueryAtStart
              );

              result.push(prefix, query, suffix);

              return [result, index + searchQueries.length];
            },
            [[text], 0]
          )[0]
          .map((str, i) =>
            i % 2 === 0 ? (
              str
            ) : (
              <mark key={i} className="bg-yellow-100" children={str} />
            )
          )}
      </>
    );
  }
}

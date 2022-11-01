import { expect, test } from "vitest";
import { getDataFromQuery } from "~/utils/queryParser";

test("getDataFromQuery should return valid data", () => {
  expect(getDataFromQuery("Hamlet Prince of Denmark")).toStrictEqual([
    { q: "Hamlet Prince of Denmark" },
  ]);
  expect(getDataFromQuery("Hamlet; Prince of Denmark")).toStrictEqual([
    { q: "Hamlet" },
    { q: "Prince of Denmark" },
  ]);
  expect(getDataFromQuery(":name John")).toStrictEqual([{ name: "John" }]);
  expect(getDataFromQuery(":title prince")).toStrictEqual([
    { title: "prince" },
  ]);
  expect(getDataFromQuery(":quote To be, or not to be")).toStrictEqual([
    { quote: "To be, or not to be" },
  ]);
  expect(getDataFromQuery(":nationality Denmark")).toStrictEqual([
    { nationality: "Denmark" },
  ]);

  expect(getDataFromQuery(":name John :name Doe")).toStrictEqual([
    { name: "Doe" },
  ]);

  expect(getDataFromQuery("John :name Doe")).toStrictEqual([
    { q: "John", name: "Doe" },
  ]);
});

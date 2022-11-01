import { expect, test } from "vitest";
import {
  getCountryCodes,
  getCountryCodeFromName,
  getCountryNameFromCode,
} from "~/utils/location";

test("getCountryCodes returns an array of country codes", () => {
  expect(getCountryCodes().length).toBe(279);
});

test("getCountryCodeFromName returns a country code for a country name", () => {
  expect(getCountryCodeFromName("Ukraine")).toBe("UA");
  expect(getCountryCodeFromName("France")).toBe("FR");
  expect(getCountryCodeFromName("USA")).toBe("US");
  expect(getCountryCodeFromName("england")).toBe("GB");
});

test("getNamesFromCountryCode returns a country name for a country code", () => {
  expect(getCountryNameFromCode("UA")).toBe("Ukraine");
  expect(getCountryNameFromCode("FR")).toBe("France");
  expect(getCountryNameFromCode("FX")).toBe("France");
  expect(getCountryNameFromCode("US")).toBe("United States");
  expect(getCountryNameFromCode("GB")).toBe("United Kingdom");

  expect(getCountryNameFromCode("AA")).toBe("AA");
});

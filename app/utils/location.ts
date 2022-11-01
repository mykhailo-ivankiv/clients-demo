import { memoizeWith, defaultTo } from "ramda";

export const getCountryCodes: (lang?: string) => string[] = memoizeWith(
  defaultTo("en"),
  (lang = "en"): string[] => {
    const A = 65;
    const Z = 90;
    const countryName = new Intl.DisplayNames([lang], { type: "region" });
    const codes = [];
    for (let i = A; i <= Z; ++i) {
      for (let j = A; j <= Z; ++j) {
        let code = String.fromCharCode(i) + String.fromCharCode(j);
        let name = countryName.of(code);

        if (code === "FX") name;

        if (code !== name) codes.push(code);
      }
    }
    return codes;
  }
);

export const getCountryNameFromCode = (countryCode: string, locale = "en") =>
  new Intl.DisplayNames([locale], { type: "region" }).of(countryCode);

export function getEmojiFlag(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const countryNameCodeMap: Record<string, string> = {
  ...getCountryCodes().reduce<Record<string, string>>((acc, code) => {
    const name = getCountryNameFromCode(code);
    if (name) acc[name.toLowerCase()] = code;
    return acc;
  }, {}),

  // Country names that are not in the Intl.DisplayNames list
  // TODO: extend the list
  usa: "US",
  england: "GB",

  // Manual corrections
  // TODO: extend the list
  france: "FR",
  "metropolitan france": "FX",
};

export const getCountryCodeFromName = (
  countryName: string
): string | undefined => countryNameCodeMap[countryName.toLowerCase()];

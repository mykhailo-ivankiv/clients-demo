import { faker } from "@faker-js/faker";

const getFullyRandomAvataaar = () =>
  // prettier-ignore
  `https://avataaars.io/?${new URLSearchParams({
    avatarStyle: "Circle",
    topType: faker.helpers.arrayElement([
      "NoHair", "Eyepatch", "Hat", "Hijab", "Turban", "WinterHat1", "WinterHat2",
      "WinterHat3", "WinterHat4", "LongHairBigHair", "LongHairBob", "LongHairBun", "LongHairCurly",
      "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro", "LongHairFroBand", "LongHairNotTooLong",
      "LongHairShavedSides", "LongHairMiaWallace", "LongHairStraight", "LongHairStraight2", "LongHairStraightStrand",
      "ShortHairDreads01", "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShaggyMullet", "ShortHairShortCurly",
      "ShortHairShortFlat", "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides", "ShortHairTheCaesar",
      "ShortHairTheCaesarSidePart",
    ]),
    accessoriesType: faker.helpers.arrayElement([
      "Blank", "Kurt", "Prescription01", "Prescription02", "Round",
      "Sunglasses", "Wayfarers",
    ]),
    hairColor: faker.helpers.arrayElement([
      "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink",
      "Blue", "Platinum", "Red", "SilverGray",
    ]),
    facialHairType: faker.helpers.arrayElement([
      "Blank", "BeardMedium", "BeardLight", "BeardMajestic", "MoustacheFancy", "MoustacheMagnum",
    ]),
    facialHairColor: faker.helpers.arrayElement([
      "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "Platinum",
      "Red",
    ]),
    clotheType: faker.helpers.arrayElement([
      "BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall",
      "ShirtCrewNeck", "ShirtScoopNeck", "ShirtVNeck",
    ]),
    clotheColor: faker.helpers.arrayElement([
      "Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather",
      "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow", "Pink",
      "Red", "White",
    ]),
    eyeType: faker.helpers.arrayElement([
      "Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy", "Hearts", "Side",
      "Squint", "Surprised", "Wink", "WinkWacky",
    ]),
    eyebrowType: faker.helpers.arrayElement([
      "Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural", "RaisedExcited",
      "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural", "UnibrowNatural", "UpDown",
      "UpDownNatural",
    ]),
    mouthType: faker.helpers.arrayElement([
      "Concerned", "Default", "Disbelief", "Eating", "Grimace", "Sad", "ScreamOpen",
      "Serious", "Smile", "Tongue", "Twinkle", "Vomit",
    ]),
    skinColor: faker.helpers.arrayElement([
      "Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black",
    ]),
  })}`;

const getRandomMaleAvataaar = () =>
  // prettier-ignore
  `https://avataaars.io/?${new URLSearchParams({
    avatarStyle: "Circle",
    topType: faker.helpers.arrayElement([
      "NoHair", "Eyepatch", "Hat", "Turban", "LongHairBigHair", "LongHairBob", "LongHairBun",
      "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro",
      "LongHairFroBand", "LongHairNotTooLong", "LongHairShavedSides", "LongHairMiaWallace", "LongHairStraight",
      "LongHairStraight2", "LongHairStraightStrand", "ShortHairDreads01", "ShortHairDreads02",
      "ShortHairFrizzle", "ShortHairShaggyMullet", "ShortHairShortCurly", "ShortHairShortFlat",
      "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides", "ShortHairTheCaesar",
      "ShortHairTheCaesarSidePart",
    ]),
    accessoriesType: faker.helpers.arrayElement([
      "Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses",
      "Wayfarers",
    ]),
    hairColor: faker.helpers.arrayElement([
      "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink",
      "Blue", "Platinum", "Red", "SilverGray",
    ]),
    facialHairType: faker.helpers.arrayElement([
      "Blank", "BeardMedium", "BeardLight", "BeardMajestic", "MoustacheFancy", "MoustacheMagnum",
    ]),
    facialHairColor: faker.helpers.arrayElement([
      "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "Platinum", "Red",
    ]),
    clotheType: faker.helpers.arrayElement([
      "BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt",
      "Hoodie", "Overall", "ShirtCrewNeck",
      "ShirtScoopNeck", "ShirtVNeck",
    ]),
    clotheColor: faker.helpers.arrayElement([
      "Black", "Blue01", "Blue02", "Blue03", "Gray01",
      "Gray02", "Heather", "PastelBlue", "PastelGreen",
      "PastelOrange", "PastelRed", "PastelYellow", "Pink", "Red",
      "White",
    ]),
    eyeType: faker.helpers.arrayElement([
      "Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy",
      "Hearts", "Side", "Squint", "Surprised", "Wink",
      "WinkWacky",
    ]),
    eyebrowType: faker.helpers.arrayElement([
      "Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural", "RaisedExcited",
      "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural", "UnibrowNatural", "UpDown",
      "UpDownNatural",
    ]),
    mouthType: faker.helpers.arrayElement([
      "Concerned", "Default", "Disbelief", "Eating", "Grimace", "Sad", "ScreamOpen",
      "Serious", "Smile", "Tongue", "Twinkle", "Vomit",
    ]),
    skinColor: faker.helpers.arrayElement([
      "Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black",
    ]),
  })}`;

const getRandomFemaleAvataaar = () =>
  // prettier-ignore
  `https://avataaars.io/?${new URLSearchParams({
    avatarStyle: "Circle",
    topType: faker.helpers.arrayElement([
      "NoHair", "Hijab", "Turban", "LongHairBigHair", "LongHairBob", "LongHairBun",
      "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro",
      "LongHairFroBand", "LongHairNotTooLong", "LongHairShavedSides", "LongHairMiaWallace",
      "LongHairStraight", "LongHairStraight2", "LongHairStraightStrand", "ShortHairDreads01",
      "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShaggyMullet", "ShortHairShortCurly",
      "ShortHairShortFlat", "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides",
      "ShortHairTheCaesar", "ShortHairTheCaesarSidePart",
    ]),
    accessoriesType: faker.helpers.arrayElement([
      "Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses",
      "Wayfarers",
    ]),
    hairColor: faker.helpers.arrayElement([
      "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink",
      "Blue", "Platinum", "Red", "SilverGray",
    ]),
    clotheType: faker.helpers.arrayElement([
      "BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie",
      "Overall", "ShirtCrewNeck", "ShirtScoopNeck", "ShirtVNeck",
    ]),
    clotheColor: faker.helpers.arrayElement([
      "Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather",
      "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow",
      "Pink", "Red", "White",
    ]),
    eyeType: faker.helpers.arrayElement([
      "Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy", "Hearts", "Side",
      "Squint", "Surprised", "Wink", "WinkWacky",
    ]),
    eyebrowType: faker.helpers.arrayElement([
      "Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural", "RaisedExcited",
      "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural", "UnibrowNatural",
      "UpDown", "UpDownNatural",
    ]),
    mouthType: faker.helpers.arrayElement([
      "Concerned", "Default", "Disbelief", "Eating", "Grimace",
      "Sad", "ScreamOpen", "Serious", "Smile",
      "Tongue", "Twinkle", "Vomit",
    ]),
    skinColor: faker.helpers.arrayElement([
      "Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black",
    ]),
  })}`;

export const getRandomAvataaar = () => {
  const sex = faker.helpers.arrayElement(["male", "female"]);

  return sex === "male" ? getRandomMaleAvataaar() : getRandomFemaleAvataaar();
}; /*?*/

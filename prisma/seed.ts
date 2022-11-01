import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'
import { faker } from '@faker-js/faker'
import { memoizeWith, defaultTo } from 'ramda'
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
      "Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses", "Wayfarers",
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
    skinColor: faker.helpers.arrayElement(["Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black",]),
  })}`

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
  })}`

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
  })}`

export const getRandomAvataaar = () => {
  const sex = faker.helpers.arrayElement(['male', 'female'])

  return sex === 'male' ? getRandomMaleAvataaar() : getRandomFemaleAvataaar()
} /*?*/

export const getCountryCodes: (lang?: string) => string[] = memoizeWith(defaultTo('en'), (lang = 'en'): string[] => {
  const A = 65
  const Z = 90
  const countryName = new Intl.DisplayNames([lang], { type: 'region' })
  const codes = []
  for (let i = A; i <= Z; ++i) {
    for (let j = A; j <= Z; ++j) {
      let code = String.fromCharCode(i) + String.fromCharCode(j)
      let name = countryName.of(code)

      if (code !== name) codes.push(code)
    }
  }
  return codes
})

export const getCountryNameFromCode = (countryCode: string, locale = 'en') =>
  new Intl.DisplayNames([locale], { type: 'region' }).of(countryCode)

export function getEmojiFlag(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const countryNameCodeMap: Record<string, string> = {
  ...getCountryCodes().reduce<Record<string, string>>((acc, code) => {
    const name = getCountryNameFromCode(code)
    if (name) acc[name.toLowerCase()] = code
    return acc
  }, {}),

  // Country names that are not in the Intl.DisplayNames list
  // TODO: extend the list
  usa: 'US',
  england: 'GB',

  // Manual corrections
  // TODO: extend the list
  france: 'FR',
  'metropolitan france': 'FX',
}

export const getCountryCodeFromName = (countryName: string): string | undefined =>
  countryNameCodeMap[countryName.toLowerCase()]

slugify.extend({ '™': '-tm' })

const prisma = new PrismaClient()

const clients = [
  {
    name: 'Brendon Taylor',
    title: 'Supervisor',
    avatar:
      'https://avataaars.io/?avatarStyle=Circle&topType=NoHair&accessoriesType=Blank&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=Hoodie&clotheColor=Gray01&eyeType=Surprised&eyebrowType=UpDown&mouthType=Twinkle&skinColor=Brown',
    quote: 'I am a super-visor!',
    nationality: 'New Zealand',
  },
  {
    name: 'Ed Joyce<sup>TM</sup>',
    title: 'Chief Technical Officer',
    avatar:
      'https://avataaars.io/?avatarStyle=Circle&topType=LongHairNotTooLong&accessoriesType=Prescription02&hatColor=PastelYellow&hairColor=BlondeGolden&facialHairType=BeardLight&facialHairColor=Black&clotheType=BlazerSweater&clotheColor=PastelGreen&eyeType=Cry&eyebrowType=UnibrowNatural&mouthType=Grimace&skinColor=Yellow',
    quote: null,
    nationality: 'Ireland',
  },
  {
    name: 'Mithali Raj',
    title: 'Data Scientist',
    avatar:
      'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight2&accessoriesType=Round&hairColor=BrownDark&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Blue03&eyeType=EyeRoll&eyebrowType=FlatNatural&mouthType=Tongue&skinColor=Tanned',
    quote: 'Here I go scraping "again"',
    nationality: 'India',
  },
  {
    name: 'Laura Fallon',
    title: 'Chief Financial Officer',
    avatar:
      'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurvy&accessoriesType=Kurt&hairColor=Red&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Squint&eyebrowType=AngryNatural&mouthType=Serious&skinColor=Tanned',
    quote: 'That costs too much $.',
  },
  {
    name: 'Alan Taylor',
    title: 'Lead Engineer',
    avatar:
      'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairTheCaesarSidePart&accessoriesType=Blank&hairColor=Platinum&facialHairType=BeardLight&facialHairColor=Blonde&clotheType=ShirtVNeck&clotheColor=Heather&eyeType=Cry&eyebrowType=SadConcerned&mouthType=ScreamOpen&skinColor=Tanned',
    quote: '80% of the time it works every time',
    nationality: 'France',
  },
]

const nameAdapter = (rawName: string) => rawName.replace('<sup>TM</sup>', '™')

const getUniqSlugFromName = async (name: string) => {
  let slug = slugify(name).toLowerCase()

  let counter = 1
  while (await prisma.client.findUnique({ where: { slug } })) {
    slug = slugify(nameAdapter(`${name} ${counter++}`)).toLowerCase()
  }
  return slug
}

function nationalityAdapter(nationality: string) {
  const countryCode = getCountryCodeFromName(nationality)
  if (!countryCode) {
    console.warn(`Could not find country code for: ${nationality}`)
  }

  return countryCode
}

async function seed() {
  await prisma.client.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  })

  for (const client of clients) {
    const name = nameAdapter(client.name)
    let slug = await getUniqSlugFromName(name)

    await prisma.client.create({
      data: {
        slug,
        name,
        title: client.title,
        avatar: client.avatar,
        quote: client.quote,
        nationality: client.nationality ? nationalityAdapter(client.nationality) : undefined,
      },
    })
  }

  for (let i = 0; i < 10000; i++) {
    const name = faker.name.fullName()
    const slug = await getUniqSlugFromName(name)

    await prisma.client.create({
      data: {
        slug,
        name,
        title: faker.name.jobTitle(),
        avatar: getRandomAvataaar(),
        quote: faker.lorem.sentence(),
        nationality: faker.address.countryCode('alpha-2'),
      },
    })
  }

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

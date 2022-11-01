import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'
import { faker } from '@faker-js/faker'
import { getRandomAvataaar } from '../app/utils/getRandomAvataaar'
import { getCountryCodeFromName } from '../app/utils/location'

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

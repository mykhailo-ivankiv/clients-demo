import slugify from 'slugify'
import { faker } from '@faker-js/faker'
import { getRandomAvataaar } from '~/utils/getRandomAvataaar'
import { getCountryCodeFromName } from '~/utils/location'
import { prisma } from '~/db.server'
import type { LoaderFunction } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

slugify.extend({ '™': '-tm' })

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

  for (let i = 0; i < 1000; i++) {
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

export const action: LoaderFunction = async () => {
  await seed()
  return 'ok'
}

export default function Seed() {
  const ok = useActionData()

  if (ok === 'ok') {
    return (
      <div className="flex h-full w-full">
        <p className="mx-auto mt-16 text-xl">Database has been seeded 🌱</p>
      </div>
    )
  }

  return (
    <Form action="." method="post" className="flex h-full w-full">
      <div className="mx-auto mt-16">
        <p className="text-xl">
          You are going to seed the database. <br /> Are you sure?
        </p>
        <button
          className="
            my-4 h-8 rounded-lg bg-slate-900 px-6 text-white hover:bg-slate-700
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          type="submit"
        >
          Yes
        </button>
      </div>
    </Form>
  )
}

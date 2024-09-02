import { useLoaderData, isRouteErrorResponse, Link, useRouteError } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { prisma } from '~/db.server'
import type { Client } from '@prisma/client'
import { getCountryNameFromCode, getEmojiFlag } from '~/utils/location'
import { useParams } from 'react-router'

type LoaderData = { client: Client }

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.clientSlug, 'noteId not found')

  const client = await prisma.client.findUnique({
    where: { slug: params.clientSlug },
  })

  if (!client) {
    throw new Response('Not Found', { status: 404 })
  }
  return json<LoaderData>({ client })
}

export default function ClientDetails() {
  const { client } = useLoaderData<LoaderData>()

  return (
    <article className="flex flex-col">
      <img className="aspect-square w-full max-w-[280px] rounded-full object-contain" src={client.avatar} alt="" />
      <h2 className="my-2 text-xl font-bold ">
        {client.name}
        <span className="block text-base font-medium  text-gray-700">{client.title}</span>
      </h2>

      {client.nationality && (
        <div>
          <span className="mr-2 text-xs text-gray-400">nationality:</span>
          {getEmojiFlag(client.nationality)} {getCountryNameFromCode(client.nationality)}
        </div>
      )}
      {client.quote && (
        <div>
          <div className="my-1 text-xs text-gray-400">quote:</div>
          <blockquote className=" ml-2 border-l-2 border-gray-300 pl-2">{client.quote}</blockquote>
        </div>
      )}
    </article>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { clientSlug } = useParams()

  return isRouteErrorResponse(error) ? (
    <div className="m-4 font-bold text-gray-400">
      Ooops! We couldn't find client with id:{' '}
      <code className="bg-gray-100 px-1 py-0.5 font-mono font-medium text-blue-700">{clientSlug}</code>
      <Link className="my-2 block text-indigo-600 underline" to="/clients">
        Start over
      </Link>
    </div>
  ) : (
    <div className="m-4 font-bold text-gray-400">
      An unexpected error occurred:{' '}
      <code className=" block bg-gray-100 px-1 py-0.5 font-mono font-medium text-blue-700">Unknown error</code>
    </div>
  )
}

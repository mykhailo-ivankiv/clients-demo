import { Form, Outlet, useLoaderData, useSubmit } from '@remix-run/react'
import { useParams } from 'react-router'
import { prisma } from '~/db.server'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { Client } from '@prisma/client'
import InputQueryClients from '~/components/InputQueryClients'
import { getPrismaFilterQueryFromString } from '~/utils/queryParser'
import ClientItem from '~/components/ClientItem'
import { getClientFromJson } from '~/models/client'
import { useMemo, useRef } from 'react'

type LoaderData = { clients: Client[] }

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.trim() || ''
  const where = getPrismaFilterQueryFromString(query)

  return json<LoaderData>({
    clients: await prisma.client.findMany({ where, take: 10 }),
  })
}

export default function Clients() {
  const { clientSlug } = useParams()
  const rawClients = useLoaderData<LoaderData>().clients
  const clients = useMemo(() => rawClients.map(getClientFromJson), [rawClients])
  const submit = useSubmit()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <main className="mx-auto min-w-[375px] max-w-[600px] px-2">
      <Form ref={formRef} action={clientSlug ? `/clients/${clientSlug}` : '/clients'} className="w-full">
        <div className="sticky top-0 z-10 mb-1 bg-white py-2">
          <InputQueryClients name="q" onChange={() => submit(formRef.current)} />
        </div>

        <div className="min-h-16 flex">
          <div className="w-[50%] min-w-[12rem] border-r border-gray-200 pr-2">
            {clients.length === 0 && <div className="m-4 font-bold text-gray-400">Nothing found try another query</div>}

            <div className="flex flex-col gap-1">
              {clients.map((client) => (
                <ClientItem key={client.id} client={client} />
              ))}
            </div>
          </div>

          <div className="ml-2 w-[50%] min-w-[10rem]">
            <Outlet />
          </div>
        </div>
      </Form>
    </main>
  )
}

import type { Client } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/server-runtime'

export const getClientFromJson = (json: SerializeFrom<Client>): Client => ({
  id: json.id,
  slug: json.slug,
  name: json.name,
  title: json.title,
  quote: json.quote,
  avatar: json.avatar,
  nationality: json.nationality,
  createdAt: new Date(json.createdAt),
  updatedAt: new Date(json.updatedAt),
})

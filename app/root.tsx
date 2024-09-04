import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import styles from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'icon',
    href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>",
  },
]

export const meta: MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'Remix Notes',
    viewport: 'width=device-width,initial-scale=1',
  },
]

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="UTF-8" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

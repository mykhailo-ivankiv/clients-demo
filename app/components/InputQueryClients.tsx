import { useState, useRef, memo } from 'react'
import { useSearchParams } from '@remix-run/react'
import { getReactComponentsFromQuery } from '~/utils/queryParser'
import { useDebounce } from 'react-use'

const Ghost = memo(function Ghost({ value }: { value: string }) {
  return <>{getReactComponentsFromQuery(value)}</>
})

export default function InputQueryClients({ name, onChange }: { name: string; onChange: (value: string) => void }) {
  const [searchParams] = useSearchParams()
  const [text, setText] = useState<string>(() => searchParams.get(name) || '')

  useDebounce(() => onChange(text), 500, [text])

  const ghostRef = useRef<HTMLDivElement>(null)
  return (
    <div className="flex border-black">
      <div
        className="box-border flex w-full whitespace-pre rounded-l-md border border-gray-500 border-r-transparent p-1
                   text-base focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
                   focus-within:ring-offset-1"
      >
        <div className="relative w-full">
          <div
            ref={ghostRef}
            className="absolute top-1 left-1 right-1 bottom-1 -z-10 block overflow-hidden whitespace-pre leading-tight"
          >
            <Ghost value={text} />
          </div>
          <input
            autoFocus={true}
            className=" block w-full bg-transparent p-1 leading-tight text-transparent caret-black focus:outline-none"
            placeholder="e.g. Brendon"
            autoComplete={'off'}
            type="search"
            value={text}
            name={name}
            onChange={(event) => setText(event.target.value)}
            onScroll={(event) => {
              if (ghostRef.current) {
                ghostRef.current.scrollLeft = event.currentTarget.scrollLeft
              }
            }}
          />
        </div>
      </div>
      <button
        className="relative right-1 rounded-r-md border border-gray-500 border-l-transparent px-2 text-black
                   focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" className="h-4 w-4">
          <g className="fill-none stroke-current stroke-1">
            <circle cx={9} cy={5} r={4.5} />
            <path d="M10.25,3.67a1.5,1.5,0,0,0-2.31-.23" fill="none" />
            <line x1={0.5} y1={13.5} x2={6.08} y2={8.43} />
          </g>
        </svg>
      </button>
    </div>
  )
}

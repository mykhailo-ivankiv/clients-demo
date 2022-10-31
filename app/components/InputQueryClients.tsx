import { useState, useRef } from "react";
import { useSearchParams } from "@remix-run/react";
import { parseQueryToReact } from "~/utils/queryParser";

function Ghost({ value }: { value: string }) {
  return <>{parseQueryToReact.run(value).result}</>;
}

export default function InputQueryClients({ name }: { name: string }) {
  const [searchParams] = useSearchParams();
  const [text, setText] = useState<string>(() => searchParams.get(name) || "");

  const ghostRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="
        relative box-border flex w-full whitespace-pre rounded-l-full border-2
        border-gray-500
        border-r-transparent
        p-1
        pl-3
        focus-within:border-blue-500
        focus-within:ring-1
        focus-within:ring-blue-500
        focus-within:ring-offset-1
      "
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
          className="
            block
            w-full
            bg-transparent
            p-1
            leading-tight text-transparent caret-black focus:outline-none"
          placeholder="e.g. Brendon"
          autoComplete={"off"}
          type="search"
          value={text}
          name={name}
          onChange={(event) => setText(event.target.value)}
          onScroll={(event) => {
            if (ghostRef.current) {
              ghostRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }
          }}
        />
      </div>
    </div>
  );
}

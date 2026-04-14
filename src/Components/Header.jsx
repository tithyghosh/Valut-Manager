import { useEffect, useState } from "react"
import { getGreeting, formatDate } from "../Utilities/Date"
const Header = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000);
    return () => clearInterval(timer);
  })

  const greetings = getGreeting(now);
  const formattedDate = formatDate(now);
  return (
    <header
            className="border-b border-neutral-800 bg-linear-to-b from-neutral-950 via-neutral-900/80 to-transparent"
        >
            <div
                className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
            >
                <div className="space-y-4">
                    <p
                        className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400"
                    >
                        Vault overview
                    </p>
                    <div
                        className="flex flex-col gap-3 md:flex-row md:items-center"
                    >
                        <h1 className="text-4xl font-semibold tracking-tight">
                            {greetings}, World!
                        </h1>
                        <span
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-900/70 px-4 py-1 text-xs font-medium text-neutral-300"
                        >
                            <span
                                className="h-2 w-2 rounded-full bg-emerald-400"
                            ></span>
                            {formattedDate}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-400 max-w-2xl">
                        Keep your most-used credentials organised and in sync
                        with every device. Review the snapshot below before
                        adding a new bookmark.
                    </p>
                </div>
            </div>
        </header>
  )
}

export default Header

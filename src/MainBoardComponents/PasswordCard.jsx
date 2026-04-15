import React, { useState } from 'react'

const getWebsiteLabel = (website) => {
  if (!website) {
    return 'Untitled'
  }

  return website
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
}

const getCardTitle = (item) => {
  if (item.name?.trim()) {
    return item.name.trim()
  }

  return getWebsiteLabel(item.website)
}
const getCardInitials = (item) => {
  return getCardTitle(item).slice(0, 2).toUpperCase()
}
const getPasswordMask = (password) => {
  return '•'.repeat(password?.length || 8)
}

const PasswordCard = ({ bookmarks, hasBookmarks, searchTerm }) => {
  const [revealedIds, setRevealedIds] = useState([])
  const hasSearchTerm = searchTerm.trim().length > 0

  const toggleReveal = (id) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  if (!hasBookmarks) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/50 p-10 text-center shadow-2xl shadow-black/20">
        <p className="text-lg font-semibold text-white">No saved credentials yet</p>
        <p className="mt-2 text-sm text-neutral-400">
          Add a website from the form above and it will appear here.
        </p>
      </div>
    )
  }

  if (hasSearchTerm && bookmarks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-800 bg-linear-to-br from-neutral-900/70 to-neutral-800/40 p-10 text-center shadow-2xl shadow-black/30">
        <p className="text-2xl font-semibold tracking-wide text-white">
          Not Found
        </p>
        <p className="mt-3 text-sm text-neutral-400">
          No result found for "
          <span className="font-medium text-blue-400">{searchTerm.trim()}</span>
          "
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Try another name or URL
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {bookmarks.map((item) => {
        const isRevealed = revealedIds.includes(item.id)

        return (
          <article
            key={item.id}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-blue-500/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 text-sm font-semibold uppercase"
                  style={{
                    color: item.color,
                    backgroundColor: `${item.color}1A`,
                  }}
                >
                  {getCardInitials(item)}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {getCardTitle(item)}
                  </h3>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    {item.category || 'Uncategorized'}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-400">
              {item.website || 'No URL'}
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Username
                </dt>
                <dd className="max-w-[65%] truncate text-neutral-50">
                  {item.username || 'No username'}
                </dd>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Password
                </dt>
                <dd className="flex items-center gap-2 text-neutral-50">
                  <span>
                    {isRevealed ? item.password : getPasswordMask(item.password)}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleReveal(item.id)}
                    className="text-xs font-semibold text-blue-400"
                  >
                    {isRevealed ? 'Hide' : 'Reveal'}
                  </button>
                </dd>
              </div>
            </dl>
          </article>
        )
      })}
       </div>
    
  )
}

export default PasswordCard

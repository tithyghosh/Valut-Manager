import React, { useState } from 'react'
import SearchBar from '../MainBoardComponents/SearchBar'
import PasswordCard from '../MainBoardComponents/PasswordCard'

const sortOptions = {
  'date-desc': (first, second) =>
    new Date(second.createdAt || 0).getTime() -
    new Date(first.createdAt || 0).getTime(),
  'date-asc': (first, second) =>
    new Date(first.createdAt || 0).getTime() -
    new Date(second.createdAt || 0).getTime(),
  'name-asc': (first, second) =>
    (first.name?.trim() || first.website || '').localeCompare(
      second.name?.trim() || second.website || '',
      undefined,
      { sensitivity: 'base' }
    ),
  'name-desc': (first, second) =>
    (second.name?.trim() || second.website || '').localeCompare(
      first.name?.trim() || first.website || '',
      undefined,
      { sensitivity: 'base' }
    ),
}

const MainBoard = ({ bookmarks }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('date-desc')
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  const filteredBookmarks = normalizedSearchTerm
    ? bookmarks.filter((item) => {
        const name = item.name?.toLowerCase() || ''
        const url = item.website?.toLowerCase() || ''

        return (
          name.includes(normalizedSearchTerm) ||
          url.includes(normalizedSearchTerm)
        )
      })
    : bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort(sortOptions[sortOrder])

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto space-y-10 px-4">
        <section className="rounded-3xl border border-neutral-800 bg-linear-to-br from-neutral-900/80 to-neutral-900/40 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </section>
        <PasswordCard
          bookmarks={sortedBookmarks}
          hasBookmarks={bookmarks.length > 0}
          searchTerm={searchTerm}
        />
      </div>
    </main>
  )
}

export default MainBoard

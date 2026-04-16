import React, { useState } from 'react'
import PasswordCard from './PasswordCard'
import SearchBar from './SearchBar'
import { DEFAULT_SORT_ORDER, filterBookmarks, sortBookmarks } from '../utils/bookmarkQuery'

const MainBoard = ({ bookmarks, onDelete, onEdit, onRevealPassword }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER)
  const [categoryFilter, setCategoryFilter] = useState('')
  const filteredBookmarks = filterBookmarks(bookmarks, searchTerm, categoryFilter)
  const sortedBookmarks = sortBookmarks(filteredBookmarks, sortOrder)

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto space-y-10 px-4">
        <section className="rounded-3xl border border-neutral-800 bg-linear-to-br from-neutral-900/80 to-neutral-900/40 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </section>
        <PasswordCard
          bookmarks={sortedBookmarks}
          hasBookmarks={bookmarks.length > 0}
          searchTerm={searchTerm}
          onDelete={onDelete}
          onEdit={onEdit}
          onRevealPassword={onRevealPassword}
        />
      </div>
    </main>
  )
}

export default MainBoard

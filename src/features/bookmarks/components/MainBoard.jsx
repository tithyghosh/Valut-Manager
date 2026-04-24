import React, { useState } from 'react'
import PasswordCard from './PasswordCard'
import SearchBar from './SearchBar'
import { BackupManager } from './BackupManager'
import { DEFAULT_SORT_ORDER, filterBookmarks, sortBookmarks } from '../utils/bookmarkQuery'

const MainBoard = ({ bookmarks, onDelete, onEdit, onRevealPassword, onRevealNotes, onImport, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER)
  const [categoryFilter, setCategoryFilter] = useState('')

  const filteredBookmarks = filterBookmarks(bookmarks, searchTerm, categoryFilter)
  const sortedBookmarks = sortBookmarks(filteredBookmarks, sortOrder)

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 px-0 sm:px-4">
        <section
          className="rounded-3xl p-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </section>

        <div className="flex justify-end">
          <BackupManager bookmarks={bookmarks} onImport={onImport} onToast={onToast} />
        </div>

        <PasswordCard
          bookmarks={sortedBookmarks}
          hasBookmarks={bookmarks.length > 0}
          searchTerm={searchTerm}
          onDelete={onDelete}
          onEdit={onEdit}
          onRevealPassword={onRevealPassword}
          onRevealNotes={onRevealNotes}
          onToast={onToast}
        />
      </div>
    </main>
  )
}

export default MainBoard

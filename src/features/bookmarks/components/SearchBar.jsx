import React, { useEffect, useRef, useState } from 'react'
import { sortChoices } from '../utils/bookmarkQuery'
import { categories } from '../utils/bookmarkForm'

const categoryColors = {
  Social: '#4d9fff', Video: '#ff6b6b', Design: '#c084fc', Streaming: '#f97316',
  Productivity: '#00e5a0', Entertainment: '#f43f5e', Shopping: '#fbbf24', Music: '#a78bfa',
}

const SearchBar = ({ searchTerm, onSearchChange, categoryFilter, onCategoryChange, sortOrder, onSortChange }) => {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef(null)
  const activeSort = sortChoices.find((c) => c.value === sortOrder) || sortChoices[0]

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setIsSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const sortLabel = {
    'date-desc': 'Newest',
    'date-asc':  'Oldest',
    'name-asc':  'A–Z',
    'name-desc': 'Z–A',
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search credentials..."
            className="w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-200"
            style={{
              background: 'var(--bg)',
              border: `1px solid ${searchTerm ? 'var(--teal)' : 'var(--border)'}`,
              boxShadow: searchTerm ? '0 0 0 3px #00e5a012' : 'none',
            }}
          />
          {searchTerm && (
            <button onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: 'var(--muted)' }}>✕</button>
          )}
        </div>

        {/* Sort dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setIsSortOpen((p) => !p)}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-3.5 text-xs font-semibold transition-all duration-200"
            style={{
              background: 'var(--bg)',
              border: `1px solid ${isSortOpen ? 'var(--teal)' : 'var(--border)'}`,
              color: 'var(--text)',
            }}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span style={{ color: 'var(--muted)' }}>Sort:</span>
            <span style={{ color: 'var(--teal)' }}>{sortLabel[activeSort.value] ?? activeSort.label}</span>
            <svg className={`h-3.5 w-3.5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
              style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isSortOpen && (
            <div className="animate-scale-in absolute right-0 top-full mt-2 z-20 w-64 rounded-2xl p-2"
              style={{ background: '#0e0f1a', border: '1px solid var(--border)', boxShadow: '0 20px 60px #00000080' }}>
              {sortChoices.map((choice) => (
                <button key={choice.value}
                  onClick={() => { onSortChange(choice.value); setIsSortOpen(false) }}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-all"
                  style={{
                    background: choice.value === sortOrder ? '#00e5a010' : 'transparent',
                    color: choice.value === sortOrder ? 'var(--teal)' : 'var(--text)',
                  }}
                >
                  <span className="font-medium">{choice.label}</span>
                  {choice.value === sortOrder && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200"
          style={{
            background: categoryFilter === '' ? 'var(--teal)' : 'var(--surface)',
            border: `1px solid ${categoryFilter === '' ? 'var(--teal)' : 'var(--border)'}`,
            color: categoryFilter === '' ? '#07080f' : 'var(--muted)',
          }}
        >All</button>

        {categories.map((cat) => {
          const color = categoryColors[cat] || 'var(--teal)'
          const active = categoryFilter === cat
          return (
            <button key={cat}
              onClick={() => onCategoryChange(cat === categoryFilter ? '' : cat)}
              className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200"
              style={{
                background: active ? `${color}20` : 'var(--surface)',
                border: `1px solid ${active ? color : 'var(--border)'}`,
                color: active ? color : 'var(--muted)',
              }}
            >{cat}</button>
          )
        })}
      </div>
    </div>
  )
}

export default SearchBar

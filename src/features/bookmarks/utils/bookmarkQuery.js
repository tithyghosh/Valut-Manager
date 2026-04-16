export const DEFAULT_SORT_ORDER = 'date-desc'

export const sortChoices = [
  {
    value: 'date-desc',
    label: 'Date: Newest First',
    hint: 'Recently added cards appear first',
  },
  {
    value: 'date-asc',
    label: 'Date: Oldest First',
    hint: 'Earlier saved cards appear first',
  },
  {
    value: 'name-asc',
    label: 'Name: A to Z',
    hint: 'Alphabetical ascending order',
  },
  {
    value: 'name-desc',
    label: 'Name: Z to A',
    hint: 'Alphabetical descending order',
  },
]

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

export const filterBookmarks = (bookmarks, searchTerm, categoryFilter) => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  return bookmarks.filter((item) => {
    const name = item.name?.toLowerCase() || ''
    const url = item.website?.toLowerCase() || ''

    const matchesSearch =
      !normalizedSearchTerm ||
      name.includes(normalizedSearchTerm) ||
      url.includes(normalizedSearchTerm)

    const matchesCategory =
      !categoryFilter || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })
}

export const sortBookmarks = (bookmarks, sortOrder) => {
  const activeSort = sortOptions[sortOrder] || sortOptions[DEFAULT_SORT_ORDER]

  return [...bookmarks].sort(activeSort)
}

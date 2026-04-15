export const getWebsiteLabel = (website) => {
  if (!website) {
    return 'Untitled'
  }

  return website
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
}

export const getCardTitle = (item) => {
  if (item.name?.trim()) {
    return item.name.trim()
  }

  return getWebsiteLabel(item.website)
}

export const getCardInitials = (item) => {
  return getCardTitle(item).slice(0, 2).toUpperCase()
}

export const getPasswordMask = (password) => {
  return '•'.repeat(password?.length || 8)
}

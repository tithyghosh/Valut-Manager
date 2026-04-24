import React from 'react'

export const BackupManager = ({ bookmarks, onImport, onToast }) => {
  const handleExport = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      count: bookmarks.length,
      data: bookmarks,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vault-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    onToast?.(`Exported ${bookmarks.length} credentials`, 'success')
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target?.result)
        if (!backup.data || !Array.isArray(backup.data)) throw new Error('Invalid backup file')
        onImport?.(backup.data)
        onToast?.(`Imported ${backup.data.length} credentials`, 'success')
      } catch {
        onToast?.('Invalid backup file', 'error')
      }
    }
    reader.readAsText(file)
    // Reset input so the same file can be re-imported if needed
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--teal)' }}
      >
        ⬇ Export Backup
      </button>
      <label
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--teal)' }}
      >
        ⬆ Import Backup
        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
      </label>
    </div>
  )
}

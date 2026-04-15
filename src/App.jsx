import React, { useState } from 'react'
import Header from './Components/Header'
import Form from './Components/Form'
import MainBoard from './Components/MainBoard'

const App = () => {
  const [bookmarks, setBookmarks] = useState([])

  const handleAddBookmark = (newBookmark) => {
    setBookmarks((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...newBookmark,
      },
      ...prev,
    ])
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Header />
      <Form onAddBookmark={handleAddBookmark} />
      <MainBoard bookmarks={bookmarks} />
    </div>
  )
}

export default App

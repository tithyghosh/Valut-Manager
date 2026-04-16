import React, { useState } from 'react'
import { categories, initialFormData } from '../utils/bookmarkForm'

const Form = ({ onAddBookmark }) => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
  }
  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim() && !formData.website.trim()){
      newErrors.name = 'Enter at least a name or url';
    }
    if (!formData.username.trim()){
      newErrors.username = 'Username is required';
    } 
    if (!formData.password.trim()){
      newErrors.password = 'Password is required'
    } 
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const foundErrors = validate () 
    if(Object.keys(foundErrors).length > 0){
      setErrors(foundErrors);
      return
    }
    setErrors({})
    onAddBookmark(formData)
    resetForm()
  }

  const handleClear = () => {
    resetForm()
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-2xl border border-neutral-800 bg-linear-to-br from-neutral-900/70 to-neutral-800/40 p-8 shadow-2xl shadow-black/40 backdrop-blur"
      >
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            New bookmark
          </p>
          <h2 className="text-2xl font-semibold">
            Store website credentials safely
          </h2>
          <p className="text-sm text-neutral-400">
            Fill the details below. Your brand color helps us render a matching
            favicon.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm transition focus-within:border-blue-500 focus-within:bg-neutral-900 focus-within:shadow-lg focus-within:shadow-blue-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Website Name
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Facebook"
                className="w-full bg-transparent text-base text-white placeholder:text-neutral-500 focus:outline-none"
              />
            {errors.name || (
              <span className='text-xs text-red-600'>{errors.name}</span>
            )}
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm transition focus-within:border-blue-500 focus-within:bg-neutral-900 focus-within:shadow-lg focus-within:shadow-blue-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Website URL
              </span>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full bg-transparent text-base text-white placeholder:text-neutral-500 focus:outline-none"
              />
              <span className="text-xs text-neutral-500">
                Include https:// for best results.
              </span>
              {errors.website && (
              <span className='text-xs text-red-600'>{errors.name}</span>
            )}
            </label>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm transition focus-within:border-blue-500 focus-within:bg-neutral-900 focus-within:shadow-lg focus-within:shadow-blue-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Favicon color
                  </p>
                  <p className="text-xs text-neutral-500">
                    Select the accent color we should render.
                  </p>
                </div>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-12 w-12 cursor-pointer rounded-full border border-neutral-700 bg-neutral-800 p-1 shadow-inner shadow-black/50"
                />
              </div>
              <div className="mt-5 flex items-center gap-3 text-xs text-neutral-500">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800/80 text-[10px] font-semibold uppercase text-neutral-400">
                  HEX
                </span>
                <span>Matches any brand primary color.</span>
              </div>
            </div>

            <label className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm transition focus-within:border-blue-500 focus-within:bg-neutral-900 focus-within:shadow-lg focus-within:shadow-blue-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Category
              </span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-transparent text-base text-white outline-none"
              >
                <option value="" className="bg-neutral-900 text-white">
                  Select category
                </option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-neutral-900 text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>
              <span className="text-xs text-neutral-500">
                Helps you filter quicker later.
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm transition focus-within:border-blue-500 focus-within:bg-neutral-900 focus-within:shadow-lg focus-within:shadow-blue-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Username
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full bg-transparent text-base text-white placeholder:text-neutral-500 focus:outline-none"
              />
              <span className="text-xs text-neutral-500">
                Use workspace or personal handle.
              </span>
              {errors.username && (
              <span className='text-xs text-red-600'>{errors.username}</span>
            )}
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm transition focus-within:border-blue-500 focus-within:bg-neutral-900 focus-within:shadow-lg focus-within:shadow-blue-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-transparent text-base text-white placeholder:text-neutral-500 focus:outline-none"
              />
              <span className="text-xs text-neutral-500">
                Choose at least 6 characters.
              </span>
              {errors.password && (
              <span className='text-xs text-red-600'>{errors.password}</span>
            )}
            </label>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-neutral-500">
            By submitting you confirm the entry is safe to store.
          </div>
          <div className="flex flex-1 justify-end gap-3">
            <button
              type="reset"
              onClick={handleClear}
              className="w-full rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white md:w-auto"
            >
              Clear
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 md:w-auto"
            >
              Add Bookmark
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Form;

import React, { useState } from 'react'
import { categories, initialFormData } from '../utils/bookmarkForm'
import { generatePassword, getPasswordStrength } from '../utils/passwordUtils'

const Field = ({ label, hint, error, children }) => (
  <label
    className="group flex flex-col gap-2.5 rounded-2xl p-5 cursor-text transition-all duration-200"
    style={{ background: 'var(--surface)', border: `1px solid ${error ? '#ff4d6a60' : 'var(--border)'}` }}
  >
    <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
      {label}
    </span>
    {children}
    {error
      ? <span className="text-xs" style={{ color: '#ff4d6a' }}>{error}</span>
      : hint
        ? <span className="text-xs" style={{ color: 'var(--muted)' }}>{hint}</span>
        : null}
  </label>
)

const inputCls = "w-full bg-transparent text-base text-white placeholder:opacity-30 focus:outline-none"

const Form = ({ onAddBookmark }) => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.name.trim() && !formData.website.trim()) e.name = 'Enter at least a name or URL'
    if (!formData.username.trim()) e.username = 'Username is required'
    if (!formData.password.trim()) e.password = 'Password is required'
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length > 0) { setErrors(found); return }
    setErrors({})
    onAddBookmark(formData)
    setFormData(initialFormData)
  }

  const strength = getPasswordStrength(formData.password)

  return (
    <div className="max-w-7xl mx-auto mt-6 sm:mt-8 px-4 sm:px-6 animate-fade-up delay-200">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-5 sm:p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0e0f1a 0%, #0a0b14 100%)',
          border: '1px solid var(--border)',
          boxShadow: '0 32px 64px #00000050',
        }}
      >
        {/* Heading */}
        <div className="mb-6 sm:mb-8 pl-5 accent-line">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] mb-2" style={{ color: 'var(--teal)' }}>
            New Entry
          </p>
          <h2 className="text-xl sm:text-2xl font-bold">Store credentials securely</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Everything is encrypted with AES-256 before saving.
          </p>
        </div>

        {/* Row 1 — name, url, color, category */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-4">
          <Field label="Website Name" error={errors.name}>
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} placeholder="e.g. GitHub"
              className={inputCls}
            />
          </Field>

          <Field label="Website URL" hint="Include https://">
            <input
              type="url" name="website" value={formData.website}
              onChange={handleChange} placeholder="https://example.com"
              className={inputCls}
            />
          </Field>

          {/* Color picker */}
          <div
            className="rounded-2xl p-5 transition-all duration-200"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
                  Brand Color
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Favicon accent</p>
              </div>
              <input
                type="color" name="color" value={formData.color}
                onChange={handleChange}
                className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0.5"
              />
            </div>
            <div
              className="h-1 rounded-full mt-3"
              style={{ background: `linear-gradient(90deg, ${formData.color}40, ${formData.color})` }}
            />
          </div>

          <Field label="Category" hint="Helps you filter later">
            <select name="category" value={formData.category} onChange={handleChange}
              className="w-full bg-transparent text-base text-white outline-none">
              <option value="" className="bg-[#0e0f1a]">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0e0f1a]">{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Row 2 — username, password */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
          <Field label="Username" hint="Email or handle" error={errors.username}>
            <input
              type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="user@example.com"
              className={inputCls}
            />
          </Field>

          <div className="flex flex-col gap-2">
            {/* Password label row with Generate button */}
            <div
              className="flex flex-col gap-2.5 rounded-2xl p-5 transition-all duration-200"
              style={{ background: 'var(--surface)', border: `1px solid ${errors.password ? '#ff4d6a60' : 'var(--border)'}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
                  Password
                </span>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, password: generatePassword() }))}
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200"
                  style={{ color: 'var(--teal)' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Generate
                </button>
              </div>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Enter password"
                className={`${inputCls} font-mono tracking-widest`}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="text-xs" style={{ color: '#ff4d6a' }}>{errors.password}</span>
              )}
            </div>

            {/* Strength bar */}
            {formData.password && (
              <div className="px-1">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength.score ? strength.color : 'var(--border)' }}
                    />
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Row 3 — notes (full width) */}
        <div className="mb-6 sm:mb-8">
          <Field
            label={<>Notes <span style={{ color: 'var(--border-bright)' }}>(optional)</span></>}
            hint="Stored encrypted alongside your credentials."
          >
            <textarea
              name="notes" value={formData.notes} onChange={handleChange}
              placeholder="2FA backup codes, security questions, hints..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <button
            type="reset"
            onClick={() => setFormData(initialFormData)}
            className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #00e5a0, #00b87a)',
              color: '#07080f',
              boxShadow: '0 8px 32px #00e5a025',
            }}
          >
            + Add Credential
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form

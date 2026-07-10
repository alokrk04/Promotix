import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { api } from '../lib/client'
import Login from './Login'

function SectionEditor({ sections, onUpdate }) {
  const [editStates, setEditStates] = useState({})
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)

  const showToast = (msg, type) => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (section) => {
    const state = editStates[section.id]
    if (!state || !('content' in state)) return
    try {
      await onUpdate(section.id, { content: state.content })
      setEditStates((s) => { const n = { ...s }; delete n[section.id]; return n })
      setErrors((s) => { const n = { ...s }; delete n[section.id]; return n })
      showToast(`${section.key} saved!`, 'ok')
    } catch {
      showToast(`Failed to save ${section.key}`, 'err')
    }
  }

  const handleToggle = async (section) => {
    try {
      await onUpdate(section.id, { is_visible: !section.is_visible })
      showToast(`${section.key} ${section.is_visible ? 'hidden' : 'visible'}`, 'ok')
    } catch {
      showToast('Toggle failed', 'err')
    }
  }

  const handleContentChange = (id, raw) => {
    setEditStates((s) => ({
      ...s,
      [id]: { ...(s[id] || {}), contentRaw: raw },
    }))
    try {
      const parsed = JSON.parse(raw)
      setEditStates((s) => ({
        ...s,
        [id]: { ...s[id], content: parsed, contentRaw: raw },
      }))
      setErrors((s) => { const n = { ...s }; delete n[id]; return n })
    } catch {
      setErrors((s) => ({ ...s, [id]: 'Invalid JSON' }))
    }
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all ${
          toast.type === 'ok' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.msg}
        </div>
      )}
      <h2 className="text-lg font-bold mb-4">Website Sections</h2>
      {sections.map((section) => {
        const editState = editStates[section.id]
        const displayContent = editState?.content ?? section.content
        const rawValue = editState?.contentRaw ?? JSON.stringify(displayContent, null, 2)
        const hasValidEdit = editState && 'content' in editState
        const hasError = errors[section.id]

        return (
          <div key={section.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold capitalize">{section.key}</span>
                <span className="text-xs text-slate">{section.title}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(section)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    section.is_visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {section.is_visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
            <textarea
              className={`w-full p-3 border rounded-lg text-sm font-mono h-32 resize-y outline-none transition-colors ${
                hasError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-violet'
              }`}
              value={rawValue}
              onChange={(e) => handleContentChange(section.id, e.target.value)}
            />
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{hasError}</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSave(section)}
                disabled={!hasValidEdit}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ListManager({ title, items, fields, onCreate, onUpdate, onDelete }) {
  const [newItem, setNewItem] = useState({})

  const handleCreate = async () => {
    if (!newItem[fields[0]?.key]) return
    const payload = { ...newItem }
    for (const f of fields) {
      if (f.type === 'number') payload[f.key] = parseInt(payload[f.key], 10) || 0
    }
    try {
      await onCreate(payload)
      setNewItem({})
    } catch {}
  }

  const fieldValue = (item, key) => item[key] ?? ''

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {items.map((item) => (
        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
          {fields.map((f) => (
            <input
              key={f.key}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet"
              type={f.type || 'text'}
              defaultValue={fieldValue(item, f.key)}
              placeholder={f.label}
              onBlur={(e) => {
                const val = f.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value
                if (val !== fieldValue(item, f.key)) {
                  onUpdate(item.id, { [f.key]: val })
                }
              }}
            />
          ))}
          <button
            onClick={() => onUpdate(item.id, { is_visible: !item.is_visible })}
            className={`px-3 py-2 text-xs font-semibold rounded-lg ${
              item.is_visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {item.is_visible ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200"
          >
            ✕
          </button>
        </div>
      ))}
      <div className="flex gap-3 items-end">
        {fields.map((f) => (
          <input
            key={f.key}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-violet"
            type={f.type || 'text'}
            placeholder={`New ${f.label}`}
            value={newItem[f.key] ?? ''}
            onChange={(e) => setNewItem((s) => ({ ...s, [f.key]: e.target.value }))}
          />
        ))}
        <button onClick={handleCreate} className="px-4 py-2 bg-violet/10 border border-dashed border-violet/30 text-violet text-sm font-semibold rounded-lg hover:bg-violet/20">
          + Add
        </button>
      </div>
    </div>
  )
}

function MessagesPanel() {
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState('')

  const load = () => api.getMessages().then(setMessages).catch(() => {})
  useEffect(() => { load() }, [])

  const filtered = messages.filter((m) =>
    !search || `${m.name} ${m.email} ${m.message} ${m.company || ''} ${m.location || ''} ${m.service || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Contact Messages ({messages.filter((m) => !m.is_read).length} unread)</h2>
      <input
        className="w-full px-4 py-2 border border-slate-200 rounded-lg mb-4 outline-none focus:border-violet text-sm"
        placeholder="Search messages..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 && <p className="text-slate text-sm">No messages</p>}
      {filtered.map((m) => (
        <div
          key={m.id}
          className={`rounded-xl p-4 mb-3 border ${m.is_read ? 'bg-white border-slate-200' : 'bg-purple-50 border-l-4 border-l-violet'}`}
        >
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="text-sm font-semibold">
              {m.name}{m.company ? ` · ${m.company}` : ''}{m.location ? ` · 📍${m.location}` : ''} · {m.email}{m.service ? ` · ${m.service}` : ''}
            </div>
            <div className="flex gap-2 items-center text-xs text-slate">
              {new Date(m.created_at).toLocaleDateString()} {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {!m.is_read && (
                <button onClick={() => api.markRead(m.id).then(load)} className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">
                  Mark Read
                </button>
              )}
              <button onClick={() => api.deleteMessage(m.id).then(load)} className="px-2 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                ✕
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{m.message}</p>
        </div>
      ))}
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const { admin, loading, logout } = useAuth()
  const [sections, setSections] = useState([])
  const [services, setServices] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [tab, setTab] = useState('sections')

  useEffect(() => {
    if (!admin) return
    api.getSections().then(setSections).catch(() => {})
    api.getServices().then(setServices).catch(() => {})
    api.getPortfolio().then(setPortfolio).catch(() => {})
    api.getTestimonials().then(setTestimonials).catch(() => {})
  }, [admin])

  if (loading) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate text-sm">Checking authentication...</div>
  if (!admin) return <Login />

  const tabs = [
    { key: 'sections', label: 'Sections' },
    { key: 'services', label: 'Services' },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'messages', label: 'Messages' },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <h2 className="font-bold">✏️ Website Editor</h2>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50">View Site</a>
          <button onClick={() => { logout(); navigate('/admin') }} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50">Logout</button>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-white px-6 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.key ? 'border-violet text-violet' : 'border-transparent text-slate hover:text-frost'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="max-w-4xl mx-auto p-6">
        {tab === 'sections' && (
          <SectionEditor
            sections={sections}
            onUpdate={async (id, body) => {
              await api.updateSection(id, body)
              const updated = await api.getSections()
              setSections(updated)
            }}
          />
        )}
        {tab === 'services' && (
          <ListManager
            title="Services"
            items={services}
            fields={[
              { key: 'section', label: 'Section (connect/properties)' },
              { key: 'name', label: 'Name' },
              { key: 'description', label: 'Description' },
              { key: 'order', label: 'Order', type: 'number' },
            ]}
            onCreate={(body) => api.createService(body).then(() => api.getServices().then(setServices))}
            onUpdate={(id, body) => api.updateService(id, body).then(() => api.getServices().then(setServices))}
            onDelete={(id) => api.deleteService(id).then(() => api.getServices().then(setServices))}
          />
        )}
        {tab === 'portfolio' && (
          <ListManager
            title="Portfolio"
            items={portfolio}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'emoji', label: 'Emoji' },
              { key: 'order', label: 'Order', type: 'number' },
            ]}
            onCreate={(body) => api.createPortfolio(body).then(() => api.getPortfolio().then(setPortfolio))}
            onUpdate={(id, body) => api.updatePortfolio(id, body).then(() => api.getPortfolio().then(setPortfolio))}
            onDelete={(id) => api.deletePortfolio(id).then(() => api.getPortfolio().then(setPortfolio))}
          />
        )}
        {tab === 'testimonials' && (
          <ListManager
            title="Testimonials"
            items={testimonials}
            fields={[
              { key: 'initials', label: 'Initials' },
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
              { key: 'content', label: 'Content' },
              { key: 'rating', label: 'Rating (1-5)', type: 'number' },
              { key: 'order', label: 'Order', type: 'number' },
            ]}
            onCreate={(body) => api.createTestimonial(body).then(() => api.getTestimonials().then(setTestimonials))}
            onUpdate={(id, body) => api.updateTestimonial(id, body).then(() => api.getTestimonials().then(setTestimonials))}
            onDelete={(id) => api.deleteTestimonial(id).then(() => api.getTestimonials().then(setTestimonials))}
          />
        )}
        {tab === 'messages' && <MessagesPanel />}
      </div>
    </div>
  )
}

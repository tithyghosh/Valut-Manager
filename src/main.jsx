import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthGate from './features/Auth/AuthGate.jsx'

export const Root = () => {
  const [masterPassword, setMasterPassword] = useState(null)

  if (!masterPassword) return <AuthGate onUnlock={(pwd) => setMasterPassword(pwd)} />

  return <App masterPassword={masterPassword} />
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)

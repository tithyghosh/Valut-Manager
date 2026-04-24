import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthGate from './features/Auth/AuthGate.jsx'
import { useToast, Toast } from './features/common/Toast'

export const Root = () => {
  const [masterPassword, setMasterPassword] = useState(null)
  const { toasts, show } = useToast()

  return (
    <>
      {!masterPassword
        ? <AuthGate onUnlock={(pwd) => setMasterPassword(pwd)} />
        : <App masterPassword={masterPassword} onLock={() => setMasterPassword(null)} onToast={show} />
      }
      <Toast toasts={toasts} />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)

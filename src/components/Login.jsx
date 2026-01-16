import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { PASSWORD } from '../config/auth'

function Login({ onLogin }) {
  const { language } = useLanguage()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password === PASSWORD) {
      localStorage.setItem('authenticated', 'true')
      onLogin()
    } else {
      setError(language === 'de' ? 'Falsches Passwort' : 'Incorrect password')
      setPassword('')
    }
  }

  const title = language === 'de' ? 'Dominion Karten-Browser' : 'Dominion Card Browser'
  const passwordLabel = language === 'de' ? 'Passwort:' : 'Password:'
  const submitButton = language === 'de' ? 'Anmelden' : 'Login'
  const placeholder = language === 'de' ? 'Passwort eingeben' : 'Enter password'

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{title}</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="password" className="login-label">
              {passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={placeholder}
              className="login-input"
              autoFocus
            />
            {error && <div className="login-error">{error}</div>}
          </div>
          <button type="submit" className="login-button">
            {submitButton}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

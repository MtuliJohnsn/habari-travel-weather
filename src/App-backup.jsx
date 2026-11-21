
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [view, setView] = useState('home')
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  function openAuth(selectedMode = 'signup') {
    setMode(selectedMode)
    setMessage('')
    setError('')
    setPassword('')
    setView('auth')
  }

  async function handleAuth(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        })

        if (error) throw error

        if (data.session) {
          setMessage('Your account has been created successfully!')
        } else {
          setMessage('Account created! Please check your email and click the confirmation link to activate your account.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        setMessage('You are now logged in!')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordReset() {
    if (!email) {
      setError('Enter your email address first.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })

      if (error) throw error

      setMessage('Password reset instructions have been sent to your email.')
    } catch (err) {
      setError(err.message || 'Unable to send password reset email.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setError(error.message)
      return
    }

    setView('home')
    setMessage('')
  }

  return (
    <div className="website">
      <nav className="navbar">
        <a href="#" className="logo" onClick={() => setView('home')}>
          HABARI<span>BIO</span>
        </a>

        <div className="nav-links">
          <a href={view === 'home' ? '#features' : '#'} onClick={() => setView('home')}>Features</a>
          <a href={view === 'home' ? '#examples' : '#'} onClick={() => setView('home')}>Examples</a>
          <a href={view === 'home' ? '#pricing' : '#'} onClick={() => setView('home')}>Pricing</a>
        </div>

        {user ? (
          <button className="nav-button" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <button className="nav-button" onClick={() => openAuth('signup')}>
            Get started
          </button>
        )}
      </nav>

      {view === 'auth' ? (
        <main className="auth-section">
          <div className="auth-card">
            <span className="eyebrow">WELCOME TO HABARI BIO</span>

            <h1>
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>

            <p className="auth-description">
              {mode === 'signup'
                ? 'Start building your own beautiful page.'
                : 'Log in to manage your HABARI Bio account.'}
            </p>

            <form onSubmit={handleAuth}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={6}
                required
              />

              <button className="primary-button auth-submit" type="submit" disabled={loading}>
                {loading
                  ? 'Please wait...'
                  : mode === 'signup'
                    ? 'Create free account'
                    : 'Log in'}
              </button>
            </form>

            {mode === 'login' && (
              <button
                className="text-button"
                type="button"
                onClick={handlePasswordReset}
                disabled={loading}
              >
                Forgot your password?
              </button>
            )}

            {message && <p className="auth-message">{message}</p>}
            {error && <p className="auth-error">{error}</p>}

            <div className="auth-switch">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => openAuth('login')}>Log in</button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => openAuth('signup')}>Sign up</button>
                </>
              )}
            </div>

            <button className="back-button" onClick={() => setView('home')}>
              ← Back to homepage
            </button>
          </div>
        </main>
      ) : user ? (
        <main className="account-section">
          <div className="account-card">
            <span className="eyebrow">YOUR HABARI BIO ACCOUNT</span>
            <h1>Welcome!</h1>
            <p>You are successfully signed in as:</p>
            <strong>{user.email}</strong>
            <p>Your account is ready. Next, we'll build your personal profile editor.</p>
            <button className="primary-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </main>
      ) : (
        <main>
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">YOUR DIGITAL IDENTITY, SIMPLIFIED</span>
              <h1>
                Everything about you.<br />
                <span>One simple link.</span>
              </h1>
              <p>
                Bring all your social media, websites, projects and
                favorite links together in one beautiful page.
              </p>
              <button className="primary-button" onClick={() => openAuth('signup')}>
                Create your free page →
              </button>
              <div className="hero-note">
                Free to start · No coding required
              </div>
            </div>

            <div className="preview-area">
              <div className="profile-card">
                <div className="profile-cover"></div>
                <div className="avatar">J</div>
                <h2>John Smith</h2>
                <p className="username">@johnsmith</p>
                <p className="bio">
                  Creator, entrepreneur and storyteller.
                  Sharing ideas and inspiration.
                </p>
                <a href="#" className="profile-link">📸 Instagram</a>
                <a href="#" className="profile-link">▶ YouTube</a>
                <a href="#" className="profile-link">𝕏 Follow me on X</a>
                <a href="#" className="profile-link">🌐 My Website</a>
                <div className="powered">Made with HABARI BIO</div>
              </div>
            </div>
          </section>

          <section id="features" className="features">
            <span className="eyebrow">ONE PAGE. MANY POSSIBILITIES.</span>
            <h2>Your online world in one place.</h2>
            <div className="feature-grid">
              <article>
                <span>🔗</span>
                <h3>All your links</h3>
                <p>Share your social media, websites and important links.</p>
              </article>
              <article>
                <span>🎨</span>
                <h3>Your own style</h3>
                <p>Build a profile that reflects your personality and brand.</p>
              </article>
              <article>
                <span>📊</span>
                <h3>Understand your audience</h3>
                <p>Discover how people interact with your page.</p>
              </article>
            </div>
          </section>

          <section id="examples" className="bottom-section">
            <h2>One link. Endless possibilities.</h2>
            <p>Make it easy for people to discover everything you do.</p>
          </section>

          <section id="pricing" className="bottom-section pricing">
            <h2>Start free. Grow with HABARI.</h2>
            <p>Create your personal page without a monthly commitment.</p>
            <button className="primary-button" onClick={() => openAuth('signup')}>
              Get started for free
            </button>
          </section>
        </main>
      )}

      <footer>
        © 2026 HABARI BIO. All rights reserved.
      </footer>
    </div>
  )
}

export default App

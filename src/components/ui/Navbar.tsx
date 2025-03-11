import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import authStore from 'stores/auth.store'
import { routes } from 'constants/routesConstants'

const Header: React.FC = observer(() => {
  const navigate = useNavigate()
  const isAuthenticated = authStore.isAuthenticated()

  const handleLogout = () => {
    authStore.signout()
    navigate(routes.HOME)
  }

  return (
    <header className="header">
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/images/GeotaggerAssets/GeotaggerColorLogo.png"
          alt="Geotagger Logo"
          style={{ height: '40px', marginRight: '8px' }}
        />
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          <span style={{ color: '#619B8A' }}>GEO</span>
          <span style={{ color: '#000' }}>tagger</span>
        </div>
      </div>

      {isAuthenticated ? (
        <nav>
          <ul className="auth-links" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <li style={{ marginRight: '16px' }}>
              <NavLink to={routes.HOME}>Home</NavLink>
            </li> 
            <li style={{ marginRight: '16px' }}>
              <NavLink to={routes.PROFILE_SETTINGS}>Profile settings</NavLink>
            </li>
            <li className="user-points" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* ✅ Ensure the NavLink fully wraps the avatar */}
              <NavLink 
                to={routes.PROFILE} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none', 
                  border: 'none', 
                  borderRadius: '60px', 
                  padding: '5px 10px',
                  cursor: 'pointer' 
                }}
              >
                <img
                  src={authStore.user?.avatar || '/images/GeotaggerAssets/Avatar.png'} 
                  alt="User Avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                />
                <span style={{ color: '#000', fontWeight: 'bold' }}>{authStore.user?.points || 0}</span>
              </NavLink>
            </li>
            <li>
              <button className="add-location-btn" style={{ width: '40px', height: '41px', borderRadius: '60px', border:'none', background: '#619B8A', color: 'white' }}>
                +
              </button>
            </li>
            <li style={{ marginRight: '16px' }}>
              <button onClick={handleLogout} className="logout-btn" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: '#619B8A' }}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul className="auth-links">
            <li>
              <NavLink to={routes.LOGIN}>Sign in</NavLink>
              <span className="separator"> or </span>
              <NavLink to={routes.SIGNUP} className="btn primary">
                Sign up
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
})

export default observer(Header)
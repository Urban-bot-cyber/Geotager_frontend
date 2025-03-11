import React from 'react'
import { NavLink ,useNavigate} from 'react-router-dom'
import authStore from 'stores/auth.store'
import { observer } from 'mobx-react-lite'
import { routes } from 'constants/routesConstants'

const Header: React.FC = observer(() => {
  const { user } = authStore // Access authentication state
  const isAuthenticated = authStore.isAuthenticated() // Check if user is authenticated
  const navigate = useNavigate()
  const handleLogout = () => {
    authStore.signout()
    navigate(routes.HOME)
  }

  return (
    <header className="header">
      <div 
        className="logo" 
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <img
          src="/images/GeotaggerAssets/GeotaggerColorLogo.png"
          alt="Geotagger Logo"
          style={{ height: '40px', marginRight: '8px' }}
        />
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          <span style={{ color: '#619B8A' }}>Geo</span>
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
              <NavLink to="/profile-settings">Profile settings</NavLink>
            </li>
            <li style={{ marginRight: '16px' }}>
              <button onClick={handleLogout} className="logout-btn" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', }}>
                Logout
              </button>
            </li>
            <li className="user-points" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <NavLink to={routes.PROFILE} style={{ textDecoration: 'none' }}>
                <div className="points-container" style={{ display: 'flex', alignItems: 'center', border: '1px solid #619B8A', borderRadius: '60px' }}>
                  <img
                    src={user?.avatar || '/images/GeotaggerAssets/Avatar.png'} 
                    alt="User Avatar"
                    style={{ width: '40px', height: '40px', borderRadius: '64px',border: 'none', marginRight: '16px' }}
                  />
                  <span style={{marginRight: '5px' }}>{user?.points || 0}</span>
                </div>
              </NavLink>
            </li>
            <li>
              <button className="add-location-btn" style={{ width: '40px', height: '41px', borderRadius: '60px', border: 'none', background: '#619B8A', color: 'white'}}>
                +
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

export default Header
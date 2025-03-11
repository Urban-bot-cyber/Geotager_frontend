import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authStore from 'stores/auth.store'
import { observer } from 'mobx-react-lite'
import * as API from 'api/Api'

interface Guess {
  id: number
  image: string
  distance: number
}

interface Location {
  id: string
  image: string
}

const Hero: React.FC = observer(() => {
  const navigate = useNavigate()
  const { user } = authStore
  const isAuthenticated = authStore.isAuthenticated()

  // State
  const [bestGuesses, setBestGuesses] = useState<Guess[]>([])
  const [latestLocations, setLatestLocations] = useState<Location[]>([])
  const [loadingGuesses, setLoadingGuesses] = useState<boolean>(false)
  const [loadingLocations, setLoadingLocations] = useState<boolean>(false)
  const [guessLimit, setGuessLimit] = useState<number>(3)
  const [locationLimit, setLocationLimit] = useState<number>(6)
  const [hasMoreGuesses, setHasMoreGuesses] = useState<boolean>(true)
  const [hasMoreLocations, setHasMoreLocations] = useState<boolean>(true)

  /**
   * Fetch data on mount if user is logged in
   */
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchBestGuesses(guessLimit, true)
      fetchLatestLocations(locationLimit, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]) // We omit guessLimit, locationLimit to avoid repeated calls on state changes

  /**
   * Fetch best guesses
   */
  const fetchBestGuesses = async (newLimit: number, initialLoad = false) => {
    try {
      setLoadingGuesses(true)
      const response = await API.getBestGuesses(newLimit) 
      // e.g. response.data = array of guesses

      if (response.data.length < newLimit) {
        setHasMoreGuesses(false)
      } else {
        setHasMoreGuesses(true)
      }

      setBestGuesses(prev => (initialLoad ? response.data : [...prev, ...response.data]))
    } catch (error) {
      console.error('Error fetching best guesses:', error)
    } finally {
      setLoadingGuesses(false)
    }
  }

  /**
   * Fetch latest locations
   */
  const fetchLatestLocations = async (newLimit: number, initialLoad = false) => {
    try {
      setLoadingLocations(true)
      const response = await API.getLocations(newLimit) 
      // e.g. response.data = array of locations

      if (response.data.length < newLimit) {
        setHasMoreLocations(false)
      } else {
        setHasMoreLocations(true)
      }

      setLatestLocations(prev => (initialLoad ? response.data : [...prev, ...response.data]))
    } catch (error) {
      console.error('Error fetching latest locations:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  /**
   * Load more guesses
   */
  const loadMoreGuesses = () => {
    if (loadingGuesses) return
    const newLimit = guessLimit + 3
    setGuessLimit(newLimit)
    fetchBestGuesses(newLimit)
  }

  /**
   * Load more locations
   */
  const loadMoreLocations = () => {
    if (loadingLocations) return
    const newLimit = locationLimit + 6
    setLocationLimit(newLimit)
    fetchLatestLocations(newLimit)
  }

  return (
    <section className="hero">
      {/**
       * If user is authenticated, show:
       * - Personal Best Guesses
       * - New Locations
       */}
      {isAuthenticated ? (
        <>
          {/* Personal Best Guesses */}
          <div className="personal-best-guesses">
            <h2 style={{ fontWeight: 'bold', color: '#619B8A' }}>Personal best guesses</h2>
            <p>Your personal best guesses appear here. Try to beat your personal records!</p>

            {loadingGuesses && bestGuesses.length === 0 ? (
              <p>Loading best guesses...</p>
            ) : bestGuesses.length > 0 ? (
              <div className="best-guesses-grid">
                {bestGuesses.map((guess, index) => (
                  <div key={guess.id} className="guess-card">
                    <img
                      src={guess.image || '/images/default-location.jpg'}
                      alt={`Best guess ${index + 1}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                    <span className="guess-distance">{guess.distance} m</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No best guesses yet. Try making some guesses!</p>
            )}

            {hasMoreGuesses && bestGuesses.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <button
                  onClick={loadMoreGuesses}
                  className="load-more-btn"
                  style={{
                    background: 'white',
                    color: '#619B8A',
                    border: '1px solid',
                    borderColor: '#619B8A',
                    borderRadius: '8px',
                  }}
                >
                  {loadingGuesses ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </div>

          {/* New Locations Section */}
          <section className="latest-locations" style={{ marginTop: '40px' }}>
            <h2
              style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', color: '#619B8A' }}
            >
              New Locations
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              New uploads from users. Try to guess all the locations by pressing on a picture.
            </p>

            {loadingLocations && latestLocations.length === 0 ? (
              <p style={{ textAlign: 'center' }}>Loading latest locations...</p>
            ) : latestLocations.length > 0 ? (
              <div
                className="locations-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                {latestLocations.map((location) => (
                  <div
                    key={location.id}
                    className="location-card"
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      border: 'none',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/guess/${location.id}`)}
                  >
                    <img
                      src={location.image || '/images/default-location.jpg'}
                      alt={`Location ${location.id}`}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>
                No locations uploaded yet.
              </p>
            )}

            {hasMoreLocations && latestLocations.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <button
                  onClick={loadMoreLocations}
                  className="load-more-btn"
                  style={{
                    background: 'white',
                    color: '#619B8A',
                    border: '1px solid',
                    borderColor: '#619B8A',
                    borderRadius: '8px',
                  }}
                >
                  {loadingLocations ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </section>
        </>
      ) : (
        <div
          className="hero-logged-out"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '40px',
            padding: '2rem',
          }}
        >
        {/* Left column: Text */}
        <div style={{ flex: '1' }}>
          <h1 style={{ fontSize: '2rem', color: '#619B8A', marginBottom: '1rem' }}>
            Explore the world with Geotagger!
          </h1>
          <p style={{ maxWidth: '600px', color: '#666', marginBottom: '2rem' }}>
            Geotagger is a website that allows you to post pictures and tag them on the map.
            Other users can try to guess their location. Join now to start exploring!
          </p>
          <button
            className="btn btn-success"
            style={{
              backgroundColor: '#619B8A',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>

        {/* Right column: Image */}
        <div style={{ flex: '1', textAlign: 'center' }}>
          <img
            src="/images/GeotaggerAssets/MapBackground.png"
            alt="Map background"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      </div>
      )}
    </section>
  )
})

export default Hero
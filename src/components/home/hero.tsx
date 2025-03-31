import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authStore from 'stores/auth.store'
import { observer } from 'mobx-react-lite'
import * as API from 'api/Api'

interface Guess {
  id: number
  image: string
  error_distance: number
  location: Location
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
  const [locationLimit, setLocationLimit] = useState<number>(1)
  const [hasMoreGuesses, setHasMoreGuesses] = useState<boolean>(true)
  const [hasMoreLocations, setHasMoreLocations] = useState<boolean>(true)

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchBestGuesses(guessLimit, true)
      fetchLatestLocations(locationLimit, true)
    }
  }, [isAuthenticated, user?.id])

  const fetchBestGuesses = async (newLimit: number, initialLoad = false) => {
    try {
      setLoadingGuesses(true)
      const response = await API.getBestGuesses(newLimit)
      
      if (response.data.data.length < newLimit) {
        setHasMoreGuesses(false)
      } else {
        setHasMoreGuesses(true)
      }

      setBestGuesses(prev => (initialLoad ? response.data.data : [...prev, ...response.data.data]))
    } catch (error) {
      console.error('Error fetching best guesses:', error)
    } finally {
      setLoadingGuesses(false)
    }
  }

  const fetchLatestLocations = async (newLimit: number, initialLoad = false) => {
    try {
      setLoadingLocations(true)
      const response = await API.getLocations(newLimit)
      const locations = response.data?.data.data || []

      if (locations.length < newLimit) {
        setHasMoreLocations(false)
      } else {
        setHasMoreLocations(true)
      }

      setLatestLocations(prev => (initialLoad ? locations : [...prev, ...locations]))
    } catch (error) {
      console.error('Error fetching latest locations:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  const loadMoreGuesses = () => {
    if (loadingGuesses) return
    const newLimit = guessLimit + 3
    setGuessLimit(newLimit)
    fetchBestGuesses(newLimit)
  }

  const loadMoreLocations = () => {
    if (loadingLocations) return
    const newLimit = locationLimit + 3
    setLocationLimit(newLimit)
    fetchLatestLocations(newLimit)
  }

  return (
    <section className="hero">
      {isAuthenticated ? (
        <>
          {/* ✅ Always Show "Personal Best Guesses" Text */}
          <div className="personal-best-guesses">
            <h2 style={{ fontWeight: 'bold', color: '#619B8A' }}>Personal best guesses</h2>
            <p>Your personal best guesses appear here. Try to beat your personal records!</p>

            {/* ✅ Only Show Guess Cards if Available */}
            
            {loadingGuesses && bestGuesses.length === 0 ? (
              <p>Loading best guesses...</p>
            ) : bestGuesses.length > 0 ? (
              <div
              className="locations-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                justifyContent: 'center',
                marginBottom: '40px',
                maxWidth: '1200px',
                margin: '0 auto',
              }}
            >
                {bestGuesses.map((guess) => (
                <div key={guess.id} className="guess-card">
                  <div className="guess-image-container">
                    <img
                      src={
                        guess.location?.image
                          ? `${process.env.REACT_APP_LARAVEL_API_URL}storage/${guess.location.image}`
                          : '/images/img-empty.jpg'
                      }
                      alt="Guess"
                      className="guess-image"
                    />
                    <div className="overlay" />
                    <span className="guess-distance-overlay">
                      {Number(guess.error_distance).toFixed(0)} m
                    </span>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <p>No best guesses yet. Try making some guesses!</p>
            )}

            {hasMoreGuesses && bestGuesses.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button onClick={loadMoreGuesses}  className='img-button p-2 mt-3'>Load more</button>
              </div>
            )} 
          </div>

          {/* ✅ Locations are Always Below Guesses */}
          <section className="latest-locations" style={{ marginTop: '60px', paddingBottom: '40px' }}>
            <h2 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '15px', color: '#619B8A' }}>
              New Locations
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px' }}>
              New uploads from users. Try to guess all the locations by pressing on a picture.
            </p>

            {loadingLocations && latestLocations.length === 0 ? (
              <p style={{ textAlign: 'center' }}>Loading latest locations...</p>
            ) : latestLocations.length > 0 ? (
              <div
                className="locations-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '30px',
                  justifyContent: 'center',
                  marginBottom: '40px',
                  maxWidth: '1200px',
                  margin: '0 auto',
                }}
              >
                {latestLocations.map((location) => (
                  <div
                  key={location.id}
                  className="location-card"
                  onClick={() => navigate(`/guess/${location.id}`)}
                >
                  <img
                    src={`${process.env.REACT_APP_LARAVEL_API_URL}storage/${location.image}` || '/images/img-empty.jpg'}
                    alt={`Location ${location.id}`}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '10px',
                    }}
                  />
                </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>No locations uploaded yet.</p>
            )}

            {hasMoreLocations && latestLocations.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button onClick={loadMoreLocations} className='img-button p-2 mt-3'>Load more</button>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
        <div
        className="hero-logged-out"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          padding: '2rem',
        }}
      >
      {/* Left column: Text */}
      <div style={{ flex: '1' }}>
        <h1 style={{ maxWidth: '200px', fontSize: '2.2rem', color: '#619B8A', marginBottom: '1rem' }}>
          Explore the world with Geotagger!
        </h1>
        <p style={{ maxWidth: '400px', color: '#666', marginBottom: '2rem' }}>
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
      <div style={{ textAlign: 'center' }}>
        <img
          src="/images/GeotaggerAssets/MapBackground.png"
          alt="Map background"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </div>
    </div>

    </>
      )}
    </section>
  )
})

export default Hero
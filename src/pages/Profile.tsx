import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Avatar from 'react-avatar'
import Layout from 'components/ui/Layout'
import authStore from 'stores/auth.store'
import * as API from 'api/Api'
import { routes } from 'constants/routesConstants'
import EditableLocationCard from 'components/location/EditableLocationCard'
import { FaCircleUser } from 'react-icons/fa6'
import { LocationType } from 'models/location'


const Profile: React.FC = observer(() => {
  const navigate = useNavigate()
  const { user } = authStore
  const userId = user?.id

  // ===== Best Guesses =====
  const [displayedGuesses, setDisplayedGuesses] = useState(3)

  const {
    data: bestGuessesResponse,
    isLoading: isBestGuessesLoading,
    error: bestGuessesError,
  } = useQuery(['getBestGuesses'], () => API.getBestGuesses(10), {
    enabled: !!userId,
  })

  const bestGuesses = bestGuessesResponse?.data?.data || []

  const loadMoreGuesses = () => {
    setDisplayedGuesses((prev) => Math.min(prev + 3, bestGuesses.length))
  }

  // ===== My Uploads (Paginated) =====
  const [locations, setLocations] = useState<LocationType[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  const [locationsError, setLocationsError] = useState<Error | null>(null)

  const fetchLocations = async () => {
    try {
      setIsLoadingLocations(true)
      const response = await API.currentUserLocations(page, 3)
      const dataWrapper = response.data?.data
      const newLocations = Array.isArray(dataWrapper?.data) ? dataWrapper.data : []
  
      setLocations((prev) => {
        const all = [...prev, ...newLocations]
        const uniqueById = Array.from(new Map(all.map(loc => [loc.id, loc])).values())
        return uniqueById
      })
  
      setHasMore(dataWrapper?.current_page < dataWrapper?.last_page)
    } catch (error: any) {
      setLocationsError(error)
    } finally {
      setIsLoadingLocations(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchLocations()
    }
  }, [page])

  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4">
          {/* Avatar */}
          {!user ? (
            <FaCircleUser className="nav-profile-button-icon" size={60} />
          ) : (
            <div className="d-flex align-items-center mb-3">
              <Avatar
                round
                src={
                  user.profile_picture
                    ? `${process.env.REACT_APP_LARAVEL_API_URL}storage/${user.profile_picture}`
                    : '/images/default-avatar.png'
                }
                name={`${user.first_name} ${user.last_name}`}
                alt="User Avatar"
                className="user-icon me-3"
              />
              <h1 className="font-weight-normal">
                {user.first_name} {user.last_name}
              </h1>
            </div>
          )}

          {/* My Best Guesses */}
          <h2 className="mt-4">My best guesses</h2>
          {isBestGuessesLoading ? (
            <div>Loading guesses...</div>
          ) : bestGuessesError ? (
            <div className="text-danger">Error fetching guesses.</div>
          ) : bestGuesses.length === 0 ? (
            <>
              <p>No best guesses yet!</p>
              <button className="btn btn-primary" onClick={() => navigate(routes.LOCATIONS)}>
                Go to locations
              </button>
            </>
          ) : (
            <>
              <div className="d-flex flex-wrap gap-3 justify-content-center mt-3">
                {bestGuesses.slice(0, displayedGuesses).map((guess: any) => (
                  <div key={guess.id} className="guess-card">
                    <div className="guess-image-container">
                      <img
                        src={`${process.env.REACT_APP_LARAVEL_API_URL}storage/${guess.location.image}`}
                        alt="Guess location"
                        className="guess-image"
                      />
                      <div className="overlay" />
                      <div className="guess-distance-overlay">
                        {Math.round(Number(guess.error_distance))} m
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {displayedGuesses < bestGuesses.length && (
                <div className="text-center mt-3">
                  <button onClick={loadMoreGuesses} className="img-button p-2 mt-3">
                    Load More
                  </button>
                </div>
              )}
            </>
          )}

          {/* My Uploads */}
          <h2 className="mt-5">My uploads</h2>
          {isLoadingLocations && page === 1 ? (
            <div>Loading uploads...</div>
          ) : locationsError ? (
            <div className="text-danger">Error fetching uploads.</div>
          ) : locations.length === 0 ? (
            <>
              <p>No uploads yet!</p>
              <button className="btn btn-success" onClick={() => navigate(routes.ADDLOCATION)}>
                Add location
              </button>
            </>
          ) : (
            <>
              <div className="d-flex flex-wrap gap-4 justify-content-center">
              {locations.map((location: LocationType) => (
                  <EditableLocationCard
                    key={`location-${location.id}`}
                    location={location}
                    onDelete={(deletedId) => {
                      setLocations(prev => prev.filter(loc => loc.id !== String(deletedId)))
                    }}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="img-button p-2 mt-3"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
})

export default Profile
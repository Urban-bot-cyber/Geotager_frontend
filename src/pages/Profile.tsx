import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Avatar from 'react-avatar'
import Layout from 'components/ui/Layout'
import authStore from 'stores/auth.store'
import * as API from 'api/Api' // <-- Where you'll define getBestGuesses() and getLocationsByUserId()
import { routes } from 'constants/routesConstants'
import EditableLocationCard from 'components/location/EditableLocationCard'
import { FaCircleUser } from 'react-icons/fa6'
import { LocationType } from 'models/location'

const Profile: React.FC = observer(() => {
  const navigate = useNavigate()
  const userId = authStore.user?.id

  // Best Guesses query
  const {
    data: bestGuessesResponse,
    isLoading: isBestGuessesLoading,
    error: bestGuessesError,
  } = useQuery(
    ['getBestGuesses'],
    () => API.getBestGuesses(10), 
    {
      // Only call if user is logged in
      enabled: !!userId,
    }
  )

  // User Locations query
  const {
    data: userLocationsResponse,
    isLoading: isUserLocationsLoading,
    error: userLocationsError,
  } = useQuery(
    ['getLocationsByUserId', userId],
    () => API.currentUserLocations(10),
    {
      enabled: !!userId,
    }
  )

  // Extract arrays from responses
  // bestGuessesResponse might look like { success: true, data: [...guesses], message: '...' }
  const bestGuesses = bestGuessesResponse?.data || []
  // userLocationsResponse might look like { success: true, data: { data: [...locations], meta: {}, links: {} }, message: '...' }
  // If you are returning a paginated response, your actual locations might be in userLocationsResponse.data.data
  const locations = userLocationsResponse?.data?.data || []

  // For "Load More" (if needed)
  const [displayedCount, setDisplayedCount] = useState(5)
  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 5, locations.length))
  }

  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4">
          {/* If no user in store, show fallback icon */}
          {!authStore.user ? (
            <FaCircleUser className="nav-profile-button-icon" size={60} />
          ) : (
            <div className="d-flex align-items-center mb-3">
              <Avatar
                round
                src={
                  authStore.user.avatar
                    ? `${process.env.REACT_APP_LARAVEL_API_URL}${authStore.user.avatar}`
                    : ''
                }
                alt="User Avatar"
                className="user-icon me-3"
              />
              <h1 className="font-weight-normal">
                {authStore.user.first_name} {authStore.user.last_name}
              </h1>
            </div>
          )}

          {/* My Best Guesses Section */}
          <h2 className="mt-4">My best guesses</h2>
          {isBestGuessesLoading ? (
            <div>Loading guesses...</div>
          ) : bestGuessesError ? (
            <div className="text-danger">Error fetching guesses.</div>
          ) : bestGuesses.length === 0 ? (
            <>
              <p>No best guesses yet!</p>
              <p>Start a new game and guess the location of the picture to see your results here.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(routes.LOCATIONS)}
              >
                Go to locations
              </button>
            </>
          ) : (
            <>
              {/* Render guesses however you'd like—cards, table, etc. */}
              {bestGuesses.map((guess: any) => (
                <div key={guess.id}>
                  {/* Replace with your own Guess component or layout */}
                  <p>Distance: {guess.error_distance}</p>
                </div>
              ))}
            </>
          )}

          {/* My Uploads Section */}
          <h2 className="mt-5">My uploads</h2>
          {isUserLocationsLoading ? (
            <div>Loading uploads...</div>
          ) : userLocationsError ? (
            <div className="text-danger">Error fetching uploads.</div>
          ) : locations.length === 0 ? (
            <>
              <p>No uploads yet!</p>
              <p>
                You can add new locations by clicking the “Add location” button below
                or in the navigation bar.
              </p>
              <button
                className="btn btn-success"
                onClick={() => navigate(routes.ADDLOCATION)}
              >
                Add location
              </button>
            </>
          ) : (
            <>
              <div className="d-flex flex-wrap gap-4 justify-content-center">
                {locations.slice(0, displayedCount).map((location: LocationType) => (
                  <EditableLocationCard key={location.id} location={location} />
                ))}
              </div>
              {displayedCount < locations.length && (
                <div className="text-center mt-4">
                  <button onClick={loadMore} className="btn btn-secondary">
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
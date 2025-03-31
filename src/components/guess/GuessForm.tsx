import { useEffect, useState, useRef } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '@googlemaps/js-api-loader'
import { Button, Form, FormLabel } from 'react-bootstrap'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface GuessFormFields {
  latitude: number
  longitude: number
  user_id: number
  location_id: number
}

const GuessForm = () => {
const { id } = useParams<{ id: string }>()
const { user } = authStore
const navigate = useNavigate()
const mapRef = useRef<HTMLDivElement>(null)
const markerRef = useRef<google.maps.Marker | null>(null)

const { control, handleSubmit, setValue, watch } = useForm<GuessFormFields>()
const [mapLoaded, setMapLoaded] = useState(false)
const [errorDistance, setErrorDistance] = useState<number | null>(null)
const [guessedAddress, setGuessedAddress] = useState<string | null>(null)

const formatGuessTime = (createdAt: string) => {
    const diffInSeconds = dayjs().diff(dayjs(createdAt), 'second')
  
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  
    return dayjs(createdAt).format('D. M. YYYY')
  }

  // Fetch leaderboard
  interface LeaderboardEntry {
    user: {
      profile_picture: string
      first_name: string
      last_name: string
    }
    error_distance: number
    created_at: string
  }

  const { data: leaderboard, refetch } = useQuery<LeaderboardEntry[]>(
    ['leaderboard', id],
    async () => {
      const response = await API.getBestGuessesByLocation(Number(id!))
      return response.data.data
    }
  )


  const reverseGeocode = (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        setGuessedAddress(results[0].formatted_address)
      } else {
        setGuessedAddress(null)
      }
    })
  }

  // Google Maps Initialization
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      })

      try {
        const google = await loader.load()
        const defaultLat = 37.7749
        const defaultLng = -122.4194

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: defaultLat, lng: defaultLng },
            zoom: 12,
          })

          const marker = new google.maps.Marker({
            position: { lat: defaultLat, lng: defaultLng },
            map,
            draggable: true,
          })

          markerRef.current = marker

          // Drag marker to update coordinates
          google.maps.event.addListener(marker, 'dragend', () => {
            const position = marker.getPosition()
            if (position) {
              setValue('latitude', position.lat())
              setValue('longitude', position.lng())
            }
          })

          // Click on map to move marker
          google.maps.event.addListener(map, 'click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const lat = event.latLng.lat()
              const lng = event.latLng.lng()

              marker.setPosition({ lat, lng })
              setValue('latitude', lat)
              setValue('longitude', lng)
            }
          })
        }

        setMapLoaded(true)
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()
  }, [setValue])

  // Update marker when form values change
  useEffect(() => {
    if (mapLoaded && markerRef.current) {
      const lat = watch('latitude')
      const lng = watch('longitude')
      if (lat && lng) {
        markerRef.current.setPosition(new google.maps.LatLng(lat, lng))
      }
    }
  }, [watch('latitude'), watch('longitude'), mapLoaded])

  // Guess submission
  const guessMutation = useMutation(
    async (data: GuessFormFields) => {
      if (!user) {
        throw new Error('User is not authenticated')
      }
      const response = await API.createGuess(
        {
          ...data,
          user_id: data.user_id.toString(),
          location_id: data.location_id.toString(), // this will now be "12"
        },
        user.id
      )
      return response.data
    },
    {
      onSuccess: (data) => {
        setErrorDistance(data.data.error_distance)
        refetch()
      },
      onError: (error) => {
        console.error('Error submitting guess:', error)
      },
    }
  )

  const onSubmit = (data: GuessFormFields) => {
    if (!user || !id) return
  
    const fullData = {
      ...data,
      user_id: Number(user.id),
      location_id: Number(id),
    }
    guessMutation.mutate(fullData)
  }

  const { data: location, isLoading } = useQuery(
    ['location', id],
    async () => {
      const response = await API.getLocationById(id!)
      return response.data
    },
    {
      enabled: !!id,
    }
  )
  return (
    <div className="guess-page">
      <div className="guess-layout">
        {/* LEFT COLUMN */}
        <div className="guess-left">
          <h2>
            Take a <span className="text-green">guess!</span>
          </h2>
  
          {/* Loading state */}
          {isLoading && <p>Loading location data...</p>}
  
          {/* Error state */}
          {!isLoading && !location && <p>Failed to load location data</p>}
  
          {/* Location Image - only render when location is available */}
          {!isLoading && location && (
            <div className='guess-image'>
              <img
                src={`${process.env.REACT_APP_LARAVEL_API_URL}storage/${location.image}`}
                alt='Guess location'
                onError={(e) => {
                  console.log('Image failed to load:', `${process.env.REACT_APP_LARAVEL_API_URL}storage/${location.image}`);
                  (e.currentTarget as HTMLImageElement).src = '/images/img-empty.jpg'
                }}
              />
            </div>
          )}
  

            {/* Google Map */}
            <div ref={mapRef} className="guess-map" />

            {/* Input Form */}
            <Form onSubmit={handleSubmit(onSubmit)} className="guess-form">
                <div className="form-row">
                    {/* Guessed Location Display */}
                    <Form.Group className="mb-3 flex-grow-1">
                    <FormLabel>Guessed location</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={guessedAddress || `${watch('latitude')}, ${watch('longitude')}`}
                        readOnly
                    />
                    </Form.Group>
                    {/* Error Distance Display */}
                    <Form.Group className="mb-2 flex-grow-2">
                    <FormLabel>Error distance</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={errorDistance !== null ? `${Math.round(errorDistance)} m` : ''}
                        readOnly
                    />
                    </Form.Group>
                </div>

                <Button type="submit" className="btn-success mt-2">Guess</Button>
            </Form>
            </div>

            {/* RIGHT COLUMN - Leaderboard */}
            <div className="guess-right">
            <h3>Leaderboard</h3>
            <div className="leaderboard">
                {leaderboard?.map((entry, index) => (
                   <div
                        key={index}
                        className={`leaderboard-entry ${
                            entry.user.first_name === user?.first_name &&
                            entry.user.last_name === user?.last_name
                            ? 'highlight-entry'
                            : ''
                        }`}
                    >
                    <div className="leaderboard-entry">
                      {/* Left: rank, avatar, name, timestamp */}
                      <div className="leaderboard-left d-flex align-items-center">
                        <span className={`rank-badge ${
                          index === 0 ? 'rank-1' :
                          index === 1 ? 'rank-2' :
                          index === 2 ? 'rank-3' : 'rank-default'
                        }`}>
                          {index + 1}
                        </span>
                  
                        <img
                          src={
                            entry.user?.profile_picture
                              ? `${process.env.REACT_APP_LARAVEL_API_URL}storage/${entry.user.profile_picture}`
                              : '/images/GeotaggerAssets/Avatar.png'
                          }
                          alt="Profile"
                          className="leaderboard-avatar"
                        />
                  
                        <div className="leaderboard-content">
                        <span className="name">
                            {user && user.id === (entry as any).user_id
                                ? 'You'
                                : `${entry.user.first_name} ${entry.user.last_name}`}
                        </span>
                          <span className="timestamp">{formatGuessTime(entry.created_at)}</span>
                        </div>
                      </div>
                  
                      {/* Right: distance */}
                      <span className="distance-text">{Number(entry.error_distance).toFixed(0)} m</span>
                    </div>
                  </div>
                ))}
                </div>
            </div>
        </div>
        </div>
  )
}

export default GuessForm
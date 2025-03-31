import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { ChangeEvent, useState, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { routes } from 'constants/routesConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import authStore from 'stores/auth.store'
import { runInAction } from 'mobx'

const EditLocationImageForm = () => {
  const navigate = useNavigate()
  const { user } = authStore

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Grab the location ID from the URL
  const { id } = useParams<{ id: string }>()
  const userId = user?.id

  // Fetch location data
  const { data: locationData } = useQuery(
    ['location', id],
    () => API.getLocationById(id as string),
    { enabled: !!id }
  )

  // Submit handler
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (!userId) {
        setApiError('User ID is required.')
        setShowError(true)
        return
      }

      const loc = locationData?.data
      // Build minimal data object for the update
      const updateData = { 
        user_id: userId, 
        id, 
        latitude: loc?.latitude || 0, 
        longitude: loc?.longitude || 0 
      }

      const fileString = file ? await file.text() : ''
      const response = await API.updateLocation(updateData, fileString)

      if (response?.statusCode >= 400) {
        setApiError(response?.message || 'Failed to update location.')
        setShowError(true)
      } else {
        const pointsResponse = await API.addPoints(userId)
        if (pointsResponse?.data) {
          runInAction(() => {
            if (authStore.user) {
              authStore.user.points = pointsResponse.data.data.new_points
            }
          })
        }
        navigate(routes.PROFILE)
      }
    } catch (error) {
      setApiError('An error occurred. Please try again later.')
      setShowError(true)
    }
  }

  // File change handler
  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files[0]) {
      setFile(target.files[0])
    }
  }

  // Remove selected file
  const handleRemoveImage = () => {
    setFile(null)
  }

  const loc = locationData?.data

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 15px' }}>
      <h1 className='mb-3'>
        <span style={{ color: '#000' }}>Edit </span>
        <span style={{ color: '#619B8A' }}>location</span>
        <span style={{ color: '#000' }}>.</span>
      </h1>

      <Form onSubmit={onSubmit}>
        {/* Image display section */}
        <Form.Group className='mb-4' style={{ textAlign: 'center' }}>
          {!file ? (
            loc?.image ? (
              <div>
                <img
                  src={`${process.env.REACT_APP_LARAVEL_API_URL}storage/${loc.image}`}
                  alt='Current location'
                  style={{ maxHeight: 200, borderRadius: 8, marginBottom: '8px' }}
                />
              </div>
            ) : (
              <div className='mb-2 text-muted'>
                <em>No image available</em>
              </div>
            )
          ) : (
            <div>
              <img
                src={URL.createObjectURL(file)}
                alt='Newly selected'
                style={{ maxHeight: 200, borderRadius: 8 }}
              />
              <div>
                <Button variant='danger' onClick={handleRemoveImage} className='mt-2'>
                  Remove image
                </Button>
              </div>
            </div>
          )}
        </Form.Group>

        {/* Coordinates row: aligned left */}
        {loc && (
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <p className='text-muted' style={{ fontSize: '1.1rem', margin: 0 }}>
              Coordinates: {loc.latitude}, {loc.longitude}
            </p>
          </div>
        )}

        {/* Buttons row: Change image left, Cancel & Save right */}
        <div className='d-flex justify-content-between align-items-center mt-4'>
          {/* Left: Change image */}
          <div>
            <input
              type='file'
              id='image'
              accept='image/*'
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor='image' className="img-button p-2 mt-3">
              Change image
            </label>
          </div>

          {/* Right: Cancel and Save buttons */}
          <div>
            <Link to={routes.PROFILE} className='btn btn-outline-secondary me-2'>
              Cancel
            </Link>
            <Button variant='success' type='submit'>
              Save
            </Button>
          </div>
        </div>
      </Form>

      {showError && (
        <ToastContainer className='p-3' position='top-end'>
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className='me-auto text-danger'>Error</strong>
            </Toast.Header>
            <Toast.Body className='text-danger bg-light'>{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </div>
  )
}

export default EditLocationImageForm
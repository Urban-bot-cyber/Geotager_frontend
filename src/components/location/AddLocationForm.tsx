import { useMutation, useQuery } from 'react-query'
import * as API from 'api/Api'
import { CreateUpdateLocationFields, useCreateUpdateLocationForm } from 'hooks/react-hook-form/useCreateUpdateLocation'
import { ChangeEvent, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { Button, Form, FormLabel } from 'react-bootstrap'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Loader } from '@googlemaps/js-api-loader'
import authStore from 'stores/auth.store'
import { runInAction } from 'mobx'
// No need to import MapMouseEvent, use google.maps.MapMouseEvent directly

const AddLocationForm = () => {
    // Get the base form handling from your custom hook
    const { handleSubmit, errors, control } = useCreateUpdateLocationForm({})
    
    // Create a separate form instance to handle the setValue and watch functions
    const formMethods = useForm<CreateUpdateLocationFields>()
    const { setValue, watch } = formMethods
    
    const {user} = authStore
    const mapRef = useRef(null)
    const markerRef = useRef<google.maps.Marker | null>(null)
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null)
    const [mapLoaded, setMapLoaded] = useState(false)

    // Watch the latitude and longitude values using the separate form instance
    const watchedLatitude = watch('latitude')
    const watchedLongitude = watch('longitude')
    // Fetch current user data

    const userId = user?.id

    // Initialize Google Maps
    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
                version: 'weekly',
            })

            try {
                const google = await loader.load()
                
                // Default to Velenje coordinates if no values are set
                const defaultLat = 46.36196367778914
                const defaultLng = 15.10928288045534
                
                if (mapRef.current) {
                    const map = new google.maps.Map(mapRef.current, {
                        center: { lat: defaultLat, lng: defaultLng },
                        zoom: 12,
                        mapTypeControl: true,
                        streetViewControl: false,
                    })
                
                // Create a marker and make it draggable
                const marker = new google.maps.Marker({
                    position: { lat: defaultLat, lng: defaultLng },
                    map: map,
                    draggable: true,
                    title: 'Drag to set location'
                })
                
                markerRef.current = marker
                
                // Update form values when marker is dragged
                google.maps.event.addListener(marker, 'dragend', function() {
                    const position = marker.getPosition()
                    if (position) {
                        // Use the control from useCreateUpdateLocationForm to update values
                        control._formValues.latitude = position.lat()
                        control._formValues.longitude = position.lng()
                    }
                    
                    // Also update the watched values
                    if (position) {
                        setValue('latitude', position.lat())
                        setValue('longitude', position.lng())
                    }
                })
                
                // Allow clicking on map to set marker position
                google.maps.event.addListener(map, 'click', (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const lat = event.latLng.lat()
                        const lng = event.latLng.lng()
                
                        control._formValues.latitude = lat
                        control._formValues.longitude = lng
                
                        setValue('latitude', lat)
                        setValue('longitude', lng)
                    }
                })
                    setMapLoaded(true)
                }
                setMapLoaded(true)
            } catch (error) {
                console.error('Error loading Google Maps:', error)
                setApiError('Failed to load map. Please try again later.')
                setShowError(true)
            }
        }

        initMap()
    }, [control, setValue])

    // Update marker position when latitude/longitude inputs change
    useEffect(() => {
        if (mapLoaded && markerRef.current && watchedLatitude && watchedLongitude) {
            const position = new google.maps.LatLng(
                parseFloat(watchedLatitude.toString()), 
                parseFloat(watchedLongitude.toString())
            )
            markerRef.current.setPosition(position)
        }
    }, [watchedLatitude, watchedLongitude, mapLoaded])


    const onSubmit = handleSubmit(async (data: CreateUpdateLocationFields) => {
        try {
            if (!userId) {
                setApiError('User ID is required.')
                setShowError(true)
                return
            }
    
            if (!file) {
                setApiError('Please upload an image.')
                setShowError(true)
                return
            }
    
            // Ensure user_id is included in data
            data.user_id = userId
    
            // Call the API to create a new location
            const response = await API.createLocation(data, file)
    
            if (response?.statusCode === StatusCode.BAD_REQUEST || 
                response?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                setApiError(response?.message || 'Failed to create location.')
                setShowError(true)
            } else {
                // If location is successfully created, add points to the user
                const pointsResponse = await API.addPoints(data.user_id)
                
                if (pointsResponse?.data) {
    
                    // Ensure authStore is updated in an observable way
                    runInAction(() => {
                        if (authStore.user) {
                            authStore.user.points = pointsResponse.data.data.new_points
                        }
                    })
    
                    navigate(`${routes.PROFILE}`)
                }
            }
        } catch (error) {
            setApiError('An error occurred. Please try again later.')
            setShowError(true)
        }
    })

    const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.files) {
            const myfile = target.files[0]
            setFile(myfile)
        }
    }
    
    const handleRemoveImage = () => {
        setFile(null)
    }

    // Helper function to sync form values between the two form instances
    const syncFormValue = (name: keyof CreateUpdateLocationFields, value: any) => {
        // Update value in the watched form
        setValue(name, value)
        
        // Update the main form's values
        if (control._formValues) {
            control._formValues[name] = value
        }
    }

    return (
        <>
            <div className='d-flex flex-column justify-content-center'>
                <div>
                    <h2>Add a new <span id='location-span'>location</span>.</h2>
                </div>
                <div>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <div className="image-upload-container">
                                {!file && (
                                    <div className="image-upload-btn p-0">
                                        <img className='w-100 rounded' src="images/img-empty.png" alt="" />
                                        <label htmlFor="image" >
                                            <input
                                                type="file"
                                                id="image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                            <div className='img-button p-2 mt-3'>Upload Image</div>
                                        </label>
                                    </div>
                                )}
                                {file && (
                                    <div className='image-upload-btn'>
                                        <div className="selected-image-container">
                                            <img className='selected-image' src={URL.createObjectURL(file)} alt="Selected" />
                                        </div>
                                        <Button onClick={handleRemoveImage} className='img-button mt-2'>
                                            Remove Image
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Form.Group>

                        {/* Google Map */}
                        <Form.Group className="mb-3">
                            <FormLabel>Location</FormLabel>
                            <div 
                                ref={mapRef} 
                                style={{ 
                                    height: '400px', 
                                    width: '100%', 
                                    borderRadius: '8px',
                                    marginBottom: '20px' 
                                }}
                            ></div>
                            <p className="text-muted">Click on the map or drag the marker to set location</p>
                        </Form.Group>

                        <Controller
                            control={control}
                            name="latitude"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="latitude">Latitude</FormLabel>
                                    <input
                                        {...field}
                                        type="number"
                                        step="any"
                                        value={watch('latitude')} // Ensure it updates in real time
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value)
                                            field.onChange(value)
                                            setValue('latitude', value, { shouldValidate: true })
                                        }}
                                        className={
                                            errors.latitude ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                        }
                                    />
                                    {errors.latitude && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.latitude.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />
                        <Controller
                            control={control}
                            name="longitude"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="longitude">Longitude</FormLabel>
                                    <input
                                        {...field}
                                        type="number"
                                        step="any"
                                        value={watch('longitude')} // Ensure it updates in real time
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value)
                                            field.onChange(value)
                                            setValue('longitude', value, { shouldValidate: true })
                                        }}
                                        className={
                                            errors.longitude ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                        }
                                    />
                                    {errors.longitude && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.longitude.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />
                        <Button className="btn btn-success" type="submit">Add new</Button>
                    </Form>
                </div>
            </div>
            
            {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-auto text-danger">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </>
    )
}

export default AddLocationForm
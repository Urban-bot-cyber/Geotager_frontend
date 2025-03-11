import { useMutation, useQuery } from 'react-query'
import * as API from 'api/Api'
import { CreateUpdateLocationFields, useCreateUpdateLocationForm } from 'hooks/react-hook-form/useCreateUpdateLocation'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { Button, Form, FormLabel } from 'react-bootstrap'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'


const AddLocationForm = () => {
    const { handleSubmit, errors, control } = useCreateUpdateLocationForm({})

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null)

    const { data } = useQuery(
        ['currentUser'],
        () => API.currentUser(),
    )



    const userId = data?.data.id
    console.log(userId)

    const { mutate: addPoints } = useMutation(
        () => API.addPoints(userId),
        {
            onError: (error) => {
                setApiError('Failed to add points. Please try again later.')
                setShowError(true)
            }
        }
    )

    const onSubmit = handleSubmit(async (data: CreateUpdateLocationFields) => {
        try {
            const formData = new FormData()
            formData.append('user_id', userId.toString())
            formData.append('latitude', data.latitude.toString())
            formData.append('longitude', data.longitude.toString())
            if (file) {
                formData.append('file', file, file.name)
            }

            if (userId) {
                data.user_id = userId
            } else {
                return
            }


            if (!file) return
            const response = await API.createLocation(data)
            if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(response.data.message)
                setShowError(true)
            } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                setApiError(response.data.message)
                setShowError(true)
            } else {

                const fileResponse = await API.uploadImage(
                    response.data.id,
                    data
                )
                if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                    setApiError(fileResponse.data.message)
                    setShowError(true)
                } else if (
                    fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
                ) {
                    setApiError(fileResponse.data.message)
                    setShowError(true)
                } else {
                    addPoints(undefined, {
                        onSuccess: () => {
                            navigate(`${routes.PROFILE}`)
                        },
                    })
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

    return (
        <>
            <div className='d-flex flex-column justify-content-center'>
                <div>
                    <h2>Add a new <span id='location-span'>Location</span>.</h2>
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

                        <Controller
                            control={control}
                            name="latitude"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="latitude">latitude</FormLabel>
                                    <input
                                        {...field}
                                        type="number"
                                        step="any"
                                        aria-label="latitude"
                                        aria-describedby="latitude"
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
                                    <FormLabel htmlFor="longitude">longitude</FormLabel>
                                    <input
                                        {...field}
                                        type="number"
                                        step="any"
                                        aria-label="longitude"
                                        aria-describedby="latilongitudeude"
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
                        <Button className="btn btn-success" type="submit"> Add new </Button>
                    </Form>
                </div>

            </div>
            {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-suto text-danger">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </>
    )
}

export default AddLocationForm

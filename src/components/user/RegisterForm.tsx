import { RegisterUserFields, useRegisterForm } from 'hooks/react-hook-form/useRegister'
import { ChangeEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import authStore from 'stores/auth.store'
import { Button, Form, FormLabel } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { routes } from 'constants/routesConstants'
import { FaCircleUser } from 'react-icons/fa6'

const RegisterForm = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useRegisterForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  // Toggling password fields
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev)

  // Avatar state
  const [file, setFile] = useState<File | null>(null)

  // On form submit
  const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
    try {
      let base64Image = null

      if (file) {
        base64Image = await getBase64(file)
      }
      const requestData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        password_confirmation: data.confirm_password,
        profile_picture: base64Image, 
      }
      
      
    const response = await API.signup(requestData) 
  
      if (!response || !response.data) {
        handleApiError('Invalid response from the server.')
        return
      }
  
      if (response.data.statusCode === StatusCode.BAD_REQUEST || 
          response.data.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        handleApiError(response.data.message)
        return
      }
  
      const userId = response.data.id
  
      // Step 2: Upload avatar (ONLY IF a file is provided)
      if (file) {
        const formData = new FormData()
        formData.append('file', file, file.name)
  
        const fileResponse = await API.uploadAvatar(formData, userId)
        
        if (!fileResponse || !fileResponse.data) {
          handleApiError('Failed to upload avatar.')
          return
        }
  
        if (fileResponse.data.statusCode === StatusCode.BAD_REQUEST || 
            fileResponse.data.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
          handleApiError(fileResponse.data.message)
          return
        }
      }
  
      // Step 3: Auto-login after successful signup
      const loginResponse = await API.signin({
        email: data.email,
        password: data.password,
      })
  
      if (!loginResponse || !loginResponse.data) {
        handleApiError('Failed to log in.')
        return
      }
  
      if (loginResponse.data.statusCode === StatusCode.BAD_REQUEST || 
          loginResponse.data.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        handleApiError(loginResponse.data.message)
        return
      }
  
      authStore.login(loginResponse.data)
      navigate('/profile')
  
    } catch (error) {
      handleApiError('An error occurred. Please try again later.')
    }
  })
  
  // Helper function to handle API errors
  const handleApiError = (message: string) => {
    setApiError(message)
    setShowError(true)
  }

  // Avatar handlers
  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      setFile(target.files[0])
    }
  }
  const handleRemoveImage = () => {
    setFile(null)
  }
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h2 className="display-5 fw-bold">Sign up</h2>
        <p className="text-center w-75">
          Your name will appear on posts and your public profile.
        </p>

        <Form className="register-form pt-0" onSubmit={onSubmit}>
          {/* Avatar Upload */}
          <Form.Group className="mb-3">
            <div className="image-upload-container">
              {!file && (
                <label htmlFor="file" className="add-image-button">
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div className="nav-profile-button-big">
                    <FaCircleUser className="nav-profile-button-icon" />
                  </div>
                </label>
              )}
              {file && (
                <div className="selected-image-container">
                  <img
                    className="selected-img"
                    src={URL.createObjectURL(file)}
                    alt="Selected"
                  />
                  <Button
                    onClick={handleRemoveImage}
                    className="x-button pt-0 pb-3 ps-0 mb-5"
                  >
                    X
                  </Button>
                </div>
              )}
            </div>
          </Form.Group>

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Form.Group className="mb-3">
                <FormLabel htmlFor="email">E-mail</FormLabel>
                <input
                  {...field}
                  type="email"
                  placeholder="example@gmail.com"
                  aria-label="Email"
                  aria-describedby="email"
                  className={
                    errors.email
                      ? 'form-control is-invalid form-rounded'
                      : 'form-control form-rounded'
                  }
                />
                {errors.email && (
                  <div className="invalid-feedback text-danger">
                    {errors.email.message}
                  </div>
                )}
              </Form.Group>
            )}
          />

          {/* First & Last Name in Row */}
          <div className="row">
            <div className="col">
              <Controller
                control={control}
                name="first_name"
                render={({ field }) => (
                  <Form.Group className="mb-3">
                    <FormLabel htmlFor="first_name">First name</FormLabel>
                    <input
                      {...field}
                      type="text"
                      placeholder="John"
                      aria-label="First name"
                      aria-describedby="first_name"
                      className={
                        errors.first_name
                          ? 'form-control is-invalid form-rounded'
                          : 'form-control form-rounded'
                      }
                    />
                    {errors.first_name && (
                      <div className="invalid-feedback text-danger">
                        {errors.first_name.message}
                      </div>
                    )}
                  </Form.Group>
                )}
              />
            </div>
            <div className="col">
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <Form.Group className="mb-3">
                    <FormLabel htmlFor="last_name">Last name</FormLabel>
                    <input
                      {...field}
                      type="text"
                      placeholder="Doe"
                      aria-label="Last name"
                      aria-describedby="last_name"
                      className={
                        errors.last_name
                          ? 'form-control is-invalid form-rounded'
                          : 'form-control form-rounded'
                      }
                    />
                    {errors.last_name && (
                      <div className="invalid-feedback text-danger">
                        {errors.last_name.message}
                      </div>
                    )}
                  </Form.Group>
                )}
              />
            </div>
          </div>
            {/* Password */}
            <Controller
            control={control}
            name="password"
            render={({ field }) => (
                <Form.Group className="mb-3">
                <FormLabel htmlFor="password">Password</FormLabel>
                <div className="input-group rounded-input-group">
                    <input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="******"
                    aria-label="Password"
                    aria-describedby="password"
                    className={
                        errors.password
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    />
                    <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                </div>
                {errors.password && (
                    <div className="invalid-feedback text-danger">
                    {errors.password.message}
                    </div>
                )}
                </Form.Group>
            )}
            />

            {/* Confirm Password */}
            <Controller
            control={control}
            name="confirm_password"
            render={({ field }) => (
                <Form.Group className="mb-3">
                <FormLabel htmlFor="confirm_password">Repeat password</FormLabel>
                <div className="input-group rounded-input-group">
                    <input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="******"
                    aria-label="Confirm password"
                    aria-describedby="confirm_password"
                    className={
                        errors.confirm_password
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    />
                    <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={toggleConfirmPasswordVisibility}
                    >
                    {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                </div>
                {errors.confirm_password && (
                    <div className="invalid-feedback text-danger">
                    {errors.confirm_password.message}
                    </div>
                )}
                </Form.Group>
            )}
            />

          {/* Submit */}
          <Button className="w-100 btn btn-success mb-2" type="submit">
            Sign up
          </Button>

          {/* Already have account */}
          <div className="d-flex flex-column mb-4 pb-4">
            <div className="d-flex justify-content-between">
              <p className="mb-0 pe-5">Already have an account?</p>
              <Link
                className="text-decoration-none link-green ps-4"
                to={routes.LOGIN}
              >
                Sign in
              </Link>
            </div>
          </div>
        </Form>
      </div>

      {/* API Error Toast */}
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

export default RegisterForm
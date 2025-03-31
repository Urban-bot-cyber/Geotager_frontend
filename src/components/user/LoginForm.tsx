import React, { useState, useCallback } from 'react'
import { LoginUserFields, useLoginForm } from 'hooks/react-hook-form/useLogin'
import { Link, useNavigate } from 'react-router-dom'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import { Controller } from 'react-hook-form'
import { Button, FormLabel, Form, ToastContainer, Toast } from 'react-bootstrap'
import { routes } from 'constants/routesConstants'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { observer } from 'mobx-react-lite' // If using MobX

const LoginForm = observer(() => {
  const navigate = useNavigate()
  const { handleSubmit, control, errors } = useLoginForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prevState => !prevState)
  }, [])

  const onSubmit = handleSubmit(async (data: LoginUserFields) => {
    setIsSubmitting(true)

    try {
      const response = await API.signin(data)
      if (response.error) {
        setApiError(response.error.message || 'An error occurred during login.')
        setShowError(true)
      } else if (response.data) {
        const { success, message, data: loginData } = response.data
        if (success) {
          // Assuming loginData contains user and access_token
          authStore.login({
            user: loginData.user,
            token: loginData.access_token,
            tokenType: loginData.token_type,
            expiresAt: loginData.expires_at,
          })
          navigate(routes.HOME)
        } else {
          setApiError(message || 'Login failed.')
          setShowError(true)
        }
      } else {
        setApiError('Unexpected response from server.')
        setShowError(true)
      }
    } catch (error) {
      console.error('Login API Error:', error)
      setApiError('An error occurred while logging in.')
      setShowError(true)
    }

    setIsSubmitting(false)
  })

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.REACT_APP_LARAVEL_API_URL}auth/google`
  }

  const handleFacebookSignIn = () => {
    window.location.href = `${process.env.REACT_APP_LARAVEL_API_URL}auth/facebook`
  }

  return (
    <>
      <div className='d-flex flex-column align-items-center justify-content-center'>
        <h2 className='display-5 fw-bold'>Sign in</h2>
        <p className='text-center w-75'>Welcome back to Geotagger. We are glad that you are back.</p>

        <Form className='login-form pt-0' onSubmit={onSubmit}>
          <Controller
            control={control}
            name='email'
            render={({ field }) => (
              <Form.Group className='mb-3'>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Form.Control
                  {...field}
                  type='email'
                  placeholder='example@gmail.com'
                  aria-label='Email'
                  aria-describedby='email'
                  isInvalid={!!errors.email}
                  className='form-rounded'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field }) => (
              <Form.Group className='mb-3 pb-3'>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <div className='input-group' style={{ position: 'relative' }}>
                  <Form.Control
                    {...field}
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='******'
                    aria-label='Password'
                    aria-describedby='password'
                    isInvalid={!!errors.password}
                    className='form-rounded'
                  />
                  <button
                    type='button'
                    className='password-toggle-btn'
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '0.1rem',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </button>
                  {errors.password && (
                    <Form.Control.Feedback type='invalid'>
                      {errors.password.message}
                    </Form.Control.Feedback>
                  )}
                </div>
              </Form.Group>
            )}
          />

          <Button className='w-100 btn btn-success mb-2' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          <Button
            className="w-100 btn btn-light mb-2 d-flex align-items-center justify-content-center"
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
            style={{ border: '1px solid #ccc' }}  // Add your desired border style here
          >
            <FcGoogle className="login-icon me-2" /> Sign in with Google
          </Button>

          <Button
            className='w-100 btn btn-primary d-flex align-items-center justify-content-center'
            onClick={handleFacebookSignIn}
            aria-label='Sign in with Facebook'
          >
            <FaFacebook className='login-icon me-2' /> Sign in with Facebook
          </Button>
        </Form>

        <div className='d-flex flex-column mb-4 pb-4'>
          <div className='d-flex justify-content-between'>
            <p className='mb-0 pe-5'>Do you want to create an account?</p>
            <Link className='text-decoration-none link-green ps-4' to={routes.SIGNUP}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {showError && (
        <ToastContainer className='p-3' position='top-end'>
          <Toast
            onClose={() => setShowError(false)}
            show={showError}
            delay={5000}
            autohide
            role='alert'
          >
            <Toast.Header>
              <strong className='me-auto text-danger'>Error</strong>
            </Toast.Header>
            <Toast.Body className='text-danger bg-light'>{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
})

export default LoginForm
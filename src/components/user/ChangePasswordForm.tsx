import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa' // <-- for the eye icons
import authStore from 'stores/auth.store'
import * as API from 'api/Api'

interface ChangePasswordFormProps {
  onClose: () => void
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Visibility toggles for each field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // A simple password check: at least 8 chars, 1 uppercase letter, 1 digit
  const isSafePassword = (password: string) => {
    const pattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    return pattern.test(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // 1. Check if new passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    // 2. Check if new password meets strength requirements
    if (!isSafePassword(newPassword)) {
      setError(
        'Password must be at least 8 characters, include at least one uppercase letter, and one digit.'
      )
      setIsSubmitting(false)
      return
    }

    try {
      // 3. Build FormData for method spoofing
      const formData = new FormData()
      formData.append('_method', 'PUT') // Tells Laravel to treat this as a PUT
      formData.append('current_password', currentPassword)
      formData.append('password', newPassword)
      formData.append('password_confirmation', confirmPassword)

      // 4. Make the API call
      const response = await API.updatePassword(formData)

      if (response.data?.success) {
        // Optionally update your auth store
        const updatedData = response.data.data
        authStore.login({
          user: updatedData.user,
          token: updatedData.access_token,
          tokenType: updatedData.token_type,
          expiresAt: updatedData.expires_at,
        }) 

        onClose() // Close the modal
      } else {
        setError(response.data?.message || 'Failed to update password.')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while updating the password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* =================== CURRENT PASSWORD =================== */}
      <Form.Group className="mb-3" controlId="formCurrentPassword">
        <Form.Label>Current Password</Form.Label>
        <div className="position-relative">
          <Form.Control
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </Form.Group>

      {/* =================== NEW PASSWORD =================== */}
      <Form.Group className="mb-3" controlId="formNewPassword">
        <Form.Label>New Password</Form.Label>
        <div className="position-relative">
          <Form.Control
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </Form.Group>

      {/* =================== CONFIRM PASSWORD =================== */}
      <Form.Group className="mb-3" controlId="formConfirmPassword">
        <Form.Label>Repeat New Password</Form.Label>
        <div className="position-relative">
          <Form.Control
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </Form.Group>

      {/* =================== ERROR MESSAGE =================== */}
      {error && <div className="text-danger mb-3">{error}</div>}

      {/* =================== ACTION BUTTONS =================== */}
      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onClose} className="me-2">
          Cancel
        </Button>
        <Button variant="success" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </Form>
  )
}

export default ChangePasswordForm
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import authStore from 'stores/auth.store'
import * as API from 'api/Api'
import ChangePasswordForm from 'components/user/ChangePasswordForm'
import ChangeProfilePictureForm from 'components/user/ChangeProfilePictureForm'

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate()
  const { user } = authStore

  // Profile fields
  const [email, setEmail] = useState(user?.email || '')
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')

  // For the main profile modal
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Controls for the "Change Password" modal
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  // **New**: Controls for the "Change Profile Picture" modal
  const [showProfilePicModal, setShowProfilePicModal] = useState(false)

  // Close the main profile modal
  const handleClose = () => {
    navigate(-1)
  }

  // Open the "Change Password" modal
  const handleOpenChangePasswordModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowChangePasswordModal(true)
  }

  // Close the "Change Password" modal
  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false)
  }

  // **New**: Open the "Change Profile Picture" modal
  const handleOpenProfilePicModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowProfilePicModal(true)
  }

  // **New**: Close the "Change Profile Picture" modal
  const handleCloseProfilePicModal = () => {
    setShowProfilePicModal(false)
  }

  // Handle the main form submission (updating name/email, etc.)
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('first_name', firstName)
      formData.append('last_name', lastName)

      const response = await API.updateUser(formData)
      if (response.data?.success) {
        // Update local store, close modal, etc.
        const updatedData = response.data.data
        authStore.login({
          user: updatedData.user,
          token: updatedData.access_token,
          tokenType: updatedData.token_type,
          expiresAt: updatedData.expires_at,
        })

        setSuccessMessage(response.data.message || 'Profile updated successfully.')
        handleClose() // or keep the modal open if desired
      } else {
        setError(response.data?.message || 'Failed to update profile.')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while updating the profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* =============== MAIN PROFILE MODAL =============== */}
      <Modal show onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Profile <span style={{ color: '#619B8A' }}>settings</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitProfile}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>

            {/* Change password link -> opens second modal */}
            <div className="mt-3">
              <a href="#" style={{ color: '#619B8A' }} onClick={handleOpenChangePasswordModal}>
                Change password
              </a>
            </div>

            {/* **New**: Change profile picture link -> opens third modal */}
            <div className="mt-2">
              <a href="#" style={{ color: '#619B8A' }} onClick={handleOpenProfilePicModal}>
                Change profile picture
              </a>
            </div>

            {/* Error / Success Messages */}
            {error && <div className="text-danger mt-3">{error}</div>}
            {successMessage && <div className="text-success mt-3">{successMessage}</div>}

            {/* Buttons */}
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Cancel
              </Button>
              <Button variant="success" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Submit'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* =============== CHANGE PASSWORD MODAL =============== */}
      <Modal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Your Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ChangePasswordForm onClose={handleCloseChangePasswordModal} />
        </Modal.Body>
      </Modal>

      {/* =============== CHANGE PROFILE PICTURE MODAL =============== */}
      <Modal show={showProfilePicModal} onHide={handleCloseProfilePicModal}>
          <ChangeProfilePictureForm 
            show={showProfilePicModal} 
            onClose={handleCloseProfilePicModal} 
            onSubmit={() => { /* handle submit logic here */ }} 
          />
      </Modal>
    </>
  )
}

export default ProfileSettings
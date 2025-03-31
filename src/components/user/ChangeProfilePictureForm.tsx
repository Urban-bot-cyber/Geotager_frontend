import React, { useState, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FaUser } from 'react-icons/fa'
import * as API from 'api/Api'// Import the API object
import authStore from 'stores/auth.store'

interface ChangeProfilePictureModalProps {
  show: boolean
  onClose: () => void
  onSubmit: (file: File, imageUrl?: string) => void // Updated to include the imageUrl
  currentPictureUrl?: string
  
}

const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({
  show,
  onClose,
  onSubmit,
  currentPictureUrl,
}) => {
  const { user } = authStore
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPictureUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      // Clean up previous object URL to avoid memory leaks
      if (previewUrl && previewUrl !== currentPictureUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file)) // Generate a preview
      setError(null) // Clear any previous errors
    }
  }

  // Called when the user clicks "Submit"
  const handleSubmit = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      // Create FormData to send the file
      const formData = new FormData()
      formData.append('profile_picture', selectedFile)
      
      // Make the API call
     
       const response = await API.updateProfilePicture(formData)
      // If successful, call the onSubmit callback with the file and the returned image URL
      if (response.data.success) {
        if (authStore.user) {
          authStore.user.profile_picture = response.data.data.profile_picture_url
        }
        onSubmit(selectedFile, response.data.data.profile_picture_url)
        onClose() // Close the modal on success
      } else {
        setError(response.data.message || 'Failed to update profile picture')
      }
    } catch (error: any) {
      console.error('Profile picture update error:', error)
      setError(
        error.response?.data?.message || 
        'An error occurred while uploading your profile picture'
      )
    } finally {
      setIsUploading(false)
    }
  }

  // Improved trigger for file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Clean up object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== currentPictureUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, currentPictureUrl])

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>Change your profile photo.</p>
        {/* Circular preview or placeholder */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#ccc',
            margin: '0 auto 1rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <FaUser size={40} color="#fff" />
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {/* Upload button triggers a hidden file input */}
        <Button
          variant="outline-success"
          onClick={triggerFileInput}
        >
          Upload new picture
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit} 
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ChangeProfilePictureModal
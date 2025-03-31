import DeleteConfirmationModal from 'components/location/DeleteConfirmationModal'
import SuccessModal from 'components/SuccessModal'
import { LocationType } from 'models/location'
import React, { useState } from 'react'
import * as API from 'api/Api'
import { Link } from 'react-router-dom'


interface Props {
    location: LocationType
    onDelete: (id: number) => void
  }
  
  const EditableLocationCard: React.FC<Props> = ({ location, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
  
    const handleDelete = async () => {
      try {
        await API.deleteLocation(Number(location.id))
        setShowConfirm(false)
        setShowSuccess(true)
        onDelete(Number(location.id))
      } catch (err) {
        console.error('Failed to delete location', err)
      }
    }
  
    return (
      <>
        <div className="location-card-editable position-relative">
          <img
            src={`${process.env.REACT_APP_LARAVEL_API_URL}storage/${location.image}`}
            alt="Location"
            className="location-card-img"
          />
  
          {/* Edit Button */}
        <Link to={`/locations/${location.id}/edit`}>
        <button className="position-absolute top-0 start-0 m-2 square-btn btn-edit">
            <i className="bi bi-pencil-fill" />
        </button>
        </Link>
          {/* Delete Button */}  
        <button
            className="position-absolute top-0 end-0 m-2 square-btn btn-delete"
            onClick={() => setShowConfirm(true)}
        >
            <i className="bi bi-x-lg" />
        </button>
        </div>

        {/* Modals */}
        <DeleteConfirmationModal
          show={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
        <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
      </>
    )
  }
  
  export default EditableLocationCard

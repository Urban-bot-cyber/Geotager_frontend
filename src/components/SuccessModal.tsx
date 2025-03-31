import React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface SuccessModalProps {
  show: boolean
  onClose: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, onClose }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Body className="text-center">
      <p>Your location was deleted.</p>
      <Button variant="success" onClick={onClose}>
        Dismiss
      </Button>
    </Modal.Body>
  </Modal>
)

export default SuccessModal
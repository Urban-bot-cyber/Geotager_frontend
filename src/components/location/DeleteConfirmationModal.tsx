import React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface DeleteConfirmationModalProps {
  show: boolean
  onClose: () => void
  onConfirm: () => void
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ show, onClose, onConfirm }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Are you sure?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>This location will be deleted. There is no undo of this action.</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="success" onClick={onConfirm}>
        Submit
      </Button>
    </Modal.Footer>
  </Modal>
)

export default DeleteConfirmationModal
import { Modal, Button } from 'react-bootstrap'

const DeleteModal = (props) => {


    return <Modal show={props.show} onHide={props.hide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete the entry "{props.title}"?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.hide}>Cancel</Button>
            <Button variant="danger" onClick={props.delete}>Delete</Button>
        </Modal.Footer>
    </Modal> 

}

export default DeleteModal;
import { Modal, Button, Form, InputGroup, ButtonGroup } from 'react-bootstrap'
import { useState, useEffect, useContext } from 'react'

import ModeContext from '../contexts/ModeContext';

const AddModal = (props) => {

    const { modes, setModes } = useContext(ModeContext);
    const [entry, setEntry] = useState();
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        setEntry({
            id: null, // should be set in [...]Library's handleAdd() function
            title: null,
            author: null,
            fandoms: null,
            wordcount: null,
            comments: null,
            link: null,
            genre: null
        });
        setValidated(false);
    }, [modes.addMode]);

    const handleChange = ({ target }) =>
        setEntry({...entry, [target.id]: target.value});

    const handleSubmit = (e) => {
        
        setValidated(true);

        const form = e.target;
        if (form.checkValidity() === true) {
           props.add(entry);
        }
 
    };

    let forms = [
        <Form.Group controlId="title" key="title">
            <Form.Label>Title</Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    placeholder="Enter title"
                    aria-label="Enter title"
                    onChange={handleChange}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    A title is required for the entry.
                </Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
    ];
    if(props.type === "Fics" || props.type === "Books") {
        forms.push(
            <Form.Group controlId="author" key="author">
                <Form.Label>Author</Form.Label>
                <Form.Control
                    placeholder="Enter author"
                    aria-label="Enter author"
                    onChange={handleChange}
                />
            </Form.Group>
        );
    }
    if(props.type === "Fics") {
        forms.push(
            <Form.Group controlId="fandoms" key="fandoms">
                <Form.Label>Fandoms</Form.Label>
                <Form.Control
                    placeholder="Enter fandoms (separated by commas)"
                    aria-label="Enter fandoms (separated by commas)"
                    onChange={handleChange}
                />
            </Form.Group>,

            <Form.Group controlId="wordcount" key="wordcount">
                <Form.Label>Wordcount</Form.Label>
                <Form.Control
                    placeholder="Enter wordcount"
                    aria-label="Enter wordcount"
                    onChange={handleChange}
                    type="number"
                />
            </Form.Group>,

            <Form.Group controlId="link" key="link">
                <Form.Label>Link</Form.Label>
                <Form.Control
                    placeholder="Enter link"
                    aria-label="Enter link"
                    onChange={handleChange}
                    type="url"
                />
            </Form.Group>
        );
    }
    else {
        forms.push(
            <Form.Group controlId="genre" key="genre">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                    placeholder="Enter genre(s) (separated by commas)"
                    aria-label="Enter genre(s) (separated by commas)"
                    onChange={handleChange}
                />
            </Form.Group>
        );
    }
    forms.push(
        <Form.Group controlId="comments" key="comments">
            <Form.Label>Comments</Form.Label>
            <Form.Control
                placeholder="Enter comments"
                aria-label="Enter comments"
                onChange={handleChange}
            />
        </Form.Group>
    );

    return <Modal show={props.show} onHide={props.hide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Add Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit} 
                className="d-flex flex-column"> 
                { forms }
                <ButtonGroup className="d-flex flex-row">
                    <Button variant="secondary" onClick={props.hide}>Cancel</Button>
                    <Button variant="primary" type="submit">Add</Button>
                </ButtonGroup>
            </Form>
        </Modal.Body>
    </Modal> 

}

export default AddModal;
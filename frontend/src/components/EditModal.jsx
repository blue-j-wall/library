import { Modal, Button, Form, InputGroup, ButtonGroup } from 'react-bootstrap'
import { useState, useEffect, useContext } from 'react'

import ModeContext from '../contexts/ModeContext';
import ActiveEntryContext from '../contexts/ActiveEntryContext';

const EditModal = (props) => {

    const { activeEntry, setActiveEntry } = useContext(ActiveEntryContext);
    const [entry, setEntry] = useState({});
    const [validated, setValidated] = useState(false);

    const resetEntry = () => {
        setEntry({
            id: null,
            title: null,
            author: null,
            fandoms: null,
            wordcount: null,
            comments: null,
            link: null,
            genre: null
        });
    }
    
    useEffect(() => { // load activeEntry into entry
        resetEntry();
        setValidated(false);
        if(props.show) setEntry(activeEntry); 
    }, [props.show]);

    const handleChange = ({ target }) =>
        setEntry({...entry, [target.id]: target.value});

    const handleSubmit = (e) => {

        setValidated(true);
        e.preventDefault();

        const form = e.target;
        if (form.checkValidity() === true) 
            props.confirm(entry);
        else
            e.stopPropagation();
    };

    // SET UP FORMS W/ PRE-LOADED CONTENTS FROM ENTRY
    let forms = [
        <Form.Group controlId="title" key="title">
            <Form.Label>Title</Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    placeholder="Enter title"
                    aria-label="Enter title"
                    onChange={handleChange}
                    value={entry.title ?? ""}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    A title is required.
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
                    value={entry.author ?? ""}
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
                    value={entry.fandoms ?? ""}
                />
            </Form.Group>,

            <Form.Group controlId="wordcount" key="wordcount">
                <Form.Label>Wordcount</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        placeholder="Enter wordcount"
                        aria-label="Enter wordcount"
                        onChange={handleChange}
                        type="number" min="0"
                        value={entry.wordcount ?? ""}
                    />
                    <Form.Control.Feedback type="invalid">
                        Must be a non-negative whole number.
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>,

            <Form.Group controlId="link" key="link">
                <Form.Label>Link</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        placeholder="Enter link"
                        aria-label="Enter link"
                        onChange={handleChange}
                        type="url"
                        value={entry.link ?? ""}
                    />
                    <Form.Control.Feedback type="invalid">
                        Must be a URL.
                    </Form.Control.Feedback>
                </InputGroup>
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
                    value={entry.genre ?? ""}
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
                value={entry.comments ?? ""}
            />
        </Form.Group>
    );

    return <Modal show={props.show} onHide={props.hide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Edit Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit} 
                className="d-flex flex-column"> 
                { forms }
                <ButtonGroup className="d-flex flex-row">
                    <Button variant="secondary" onClick={props.hide}>Cancel</Button>
                    <Button variant="primary" type="submit">Confirm</Button>
                </ButtonGroup>
            </Form>
        </Modal.Body>
    </Modal> 

}

export default EditModal;
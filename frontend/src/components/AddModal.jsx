import { Modal, Button, Form, InputGroup, ButtonGroup } from 'react-bootstrap'
import { useState, useEffect, useContext } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import * as formik from 'formik';

import ModeContext from '../contexts/ModeContext';

const AddModal = (props) => {

    const { modes, setModes } = useContext(ModeContext);
    const [entry, setEntry] = useState();
    const [validated, setValidated] = useState(false);
    const [key, setKey] = useState('manual');

    useEffect(() => { // switching between tabs
        resetEntryAndForms();
        setValidated(false);
    }, [modes.addMode, key]);

    useEffect(() => {
        console.log(validated);
    }, [validated])

    const resetEntryAndForms = () => {
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
        let manualForm = document.getElementById("manual-form");
        let linkForm = document.getElementById("link-form");
        if(manualForm && linkForm) {
            manualForm.reset();
            linkForm.reset();
        }
    }

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
                <InputGroup hasValidation>
                    <Form.Control
                        placeholder="Enter wordcount"
                        aria-label="Enter wordcount"
                        onChange={handleChange}
                        type="number" min="0"
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
            <Tabs 
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3">
                
                <Tab eventKey="manual" title="Manually">
                    <Form id="manual-form" noValidate validated={validated} onSubmit={handleSubmit} 
                        className="d-flex flex-column"> 
                        { forms }
                        <ButtonGroup className="modal-options d-flex flex-row">
                            <Button variant="secondary" onClick={props.hide}>Cancel</Button>
                            <Button variant="primary" type="submit">Add</Button>
                        </ButtonGroup>
                    </Form>
                </Tab>

                <Tab eventKey="link" title="By Link">
                    <Form id="link-form" noValidate validated={validated} onSubmit={handleSubmit} 
                        className="d-flex flex-column"> 
                        <Form.Group controlId="link" key="link">
                            <InputGroup hasValidation>
                                <Form.Control
                                    placeholder="Enter link"
                                    aria-label="Enter link"
                                    onChange={handleChange}
                                    type="url"
                                    required
                                />
                                {/**
                                 * TODO: add additional validation for correct website
                                 * !entry.link.startsWith("https://archiveofourown.org/works/") 
                                    && !entry.link.startsWith("https://www.fanfiction.net/s/"))
                                 */}
                                <Form.Control.Feedback type="invalid">
                                    Must be a URL of a single work from AO3 or FFnet.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <ButtonGroup className="modal-options d-flex flex-row">
                            <Button variant="secondary" onClick={props.hide}>Cancel</Button>
                            <Button variant="primary" type="submit">Add</Button>
                        </ButtonGroup>
                    </Form>
                </Tab>

            </Tabs>
        </Modal.Body>
    </Modal> 

}

export default AddModal;
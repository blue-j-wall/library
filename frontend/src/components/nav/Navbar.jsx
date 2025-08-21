import { useEffect, useState, useContext } from 'react'
import { Container, Nav, Navbar, Form, Button, DropdownButton, Dropdown, ButtonGroup, ToggleButton, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import SearchContext from '../../contexts/SearchContext';
import ModeContext from '../../contexts/ModeContext';

export default function PageNavbar(props) {

    const { params, setParams } = useContext(SearchContext);
    const { modes, setModes } = useContext(ModeContext);

    // CHECKBOX STUFF --------------------
    let checkboxes = ["title"]
    let location = useLocation();
    if (location.pathname == "/fics") {
        checkboxes.push("author");
        checkboxes.push("fandoms");
    }
    else if (location.pathname == "/books") {
        checkboxes.push("author");
        checkboxes.push("genre");
    }
    else if (location.pathname == "/movies" || location.pathname == "/shows") {
        checkboxes.push("genre");
    }
    checkboxes.push("comments");

    const handleToggle = ({ target }) =>
        setParams({...params, [target.id]: !params[target.id]});

    // RADIO & WORDCOUNT RANGE SELECTION
    let ficOnly = []
    if(location.pathname == "/fics") {
        ficOnly.push(
            <div key="chapter-select">
                <p>Chapter select:</p>
                    <Form.Check
                        type="radio"
                        name="chapter-select"
                        id="all"
                        label="all works"
                        checked={params.chapterRadio == "all"}
                        onChange={(e) => { setParams({...params, chapterRadio:"all"}); }}
                    />
                    <Form.Check
                        type="radio"
                        name="chapter-select"
                        id="multi"
                        label="multichapter only"
                        checked={params.chapterRadio == "multi"}
                        onChange={(e) => { setParams({...params, chapterRadio:"multi"}); }}
                    />
                    <Form.Check
                        type="radio"
                        name="chapter-select"
                        id="single"
                        label="single chapter only"
                        checked={params.chapterRadio == "single"}
                        onChange={(e) => { setParams({...params, chapterRadio:"single"}); }}
                    />
            </div>
        )
        ficOnly.push(
            <div key="wordcount-range">
                <p>Wordcount range:</p>
                <Form.Control 
                    id="lowerbound-wordcount"
                    placeholder="lower bound"
                    aria-label="lower bound"
                    type="number"
                    value={params.lowerBound}
                    onChange={(e) => setParams({...params, lowerBound: e.target.value})}
                />
                <Form.Control 
                    id="upperbound-wordcount"
                    placeholder="upper bound"
                    aria-label="upper bound"
                    type="number"
                    value={params.upperBound}
                    onChange={(e) => setParams({...params, upperBound: e.target.value})}
                />
            </div>
        )
    }


    // -----------------------------------


    return <Navbar id="library-navbar" bg="dark" variant="dark" fixed="top" expand="sm" collapseOnSelect>
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            {
                <Navbar.Brand as={Link} to="/">
                    <img
                        alt="book stack emoji"
                        src="https://em-content.zobj.net/source/apple/419/books_1f4da.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    The Library
                </Navbar.Brand>
            }
            <Navbar.Collapse id="responsive-navbar-nav" className="me-auto">
                <Nav>
                    <Nav.Link as={Link} to="/fics">Fanfics</Nav.Link>
                    <Nav.Link as={Link} to="/books">Books</Nav.Link>
                    <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
                    <Nav.Link as={Link} to="/shows">Shows</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            

            {/*
            <Button 
                id="comments-button"
                variant="outline-primary"
                // value
                // onChange
            >
                hide comments
            </Button>
            */}

            
            <ButtonGroup>
                <ToggleButton
                    id="card-radio"
                    type="radio"
                    variant="outline-success"
                    name="view-select"
                    checked={modes.viewRadio == "card"}
                    onChange={(e) => { setModes({...modes, viewRadio:"card"}); }}
                >
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/9/97/Grid_icon.svg" width="20px"/>
                </ToggleButton>
                <ToggleButton
                    id="list-radio"
                    type="radio"
                    variant="outline-success"
                    name="view-select"
                    checked={modes.viewRadio == "list"}
                    onChange={(e) => { setModes({...modes, viewRadio:"list"}); }}
                >
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Hamburger_icon.svg" width="25px"/>
                </ToggleButton>
            </ButtonGroup>

            <Button id="editMode" onClick={(e) => { setModes({...modes, editMode: !modes.editMode}); }} variant="secondary">Edit Entries</Button>

            <Button variant="primary">Add Entry</Button>



            <Form className="d-flex">
                <Form.Control
                    id="search-bar"
                    type="search"
                    placeholder="⌕ Search"
                    className="me-2 rounded-pill"
                    aria-label="Search Media"
                    onChange={(e) => setParams({...params, search: e.target.value})}
                />

                <DropdownButton id="dropdown-basic-button" title="Options" variant="dark" bg="dark">
                    <Container>
                        <p>Fields to search:</p>
                        {
                            checkboxes.map(checkName => 
                                <Form.Check
                                    type="checkbox"
                                    key={checkName}
                                    id={checkName}
                                    label={checkName}
                                    onChange={handleToggle}
                                    checked={params[checkName]}
                                />
                            )
                        }
                        { ficOnly }
                    </Container>
                </DropdownButton>
            </Form>
            
        </Container>
    </Navbar>
}
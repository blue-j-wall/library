import { useEffect, useState, useContext } from 'react'
import { Container, Nav, Navbar, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import SearchContext from '../../contexts/SearchContext';

export default function PageNavbar(props) {

    const { params, setParams } = useContext(SearchContext);

    // CHECKBOX STUFF ---------
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
    // --------------------------

    const handleToggle = ({ target }) =>
        setParams({...params, [target.id]: !params[target.id]});

    return <Navbar bg="dark" variant="dark" fixed="top" expand="sm" collapseOnSelect>
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

            <Form className="d-flex">
                <Form.Control
                    id="search-bar"
                    type="search"
                    placeholder="⌕ Search"
                    className="me-2"
                    aria-label="Search Media"
                    onChange={(e) => setParams({...params, search: e.target.value})}
                />
                <DropdownButton id="dropdown-basic-button" title="Search...">
                    <Container>
                    {
                        checkboxes.map(checkName => 
                            <Form.Check
                                inline
                                type="checkbox"
                                key={checkName}
                                id={checkName}
                                label={checkName}
                                onChange={handleToggle}
                                checked={params[checkName]}
                            />
                        )
                    }
                    </Container>
                </DropdownButton>
            </Form>

        </Container>
    </Navbar>
}
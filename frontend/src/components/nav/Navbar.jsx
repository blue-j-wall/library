import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BadgerBudsNavbar(props) {
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
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                />
                <Button variant="outline-success">➥</Button>
            </Form>
        </Container>
    </Navbar>
}
import { useEffect, useState, useContext } from 'react'
import { Container, Nav, Navbar, Form, ListGroup, DropdownButton, Dropdown, ButtonGroup, ToggleButton, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import { IoOptions, IoGridOutline } from "react-icons/io5";
import { FaEdit, FaList, FaBookReader } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import useBreakpoint from 'use-breakpoint';

import SearchContext from '../../contexts/SearchContext';
import ModeContext from '../../contexts/ModeContext';

export default function PageNavbar(props) {

    let location = useLocation();

    const { params, setParams } = useContext(SearchContext);
    const { modes, setModes } = useContext(ModeContext);

    // CHECKBOX STUFF 
    let checkboxes = ["title"]
    
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
                    placeholder="min"
                    aria-label="min"
                    type="number"
                    value={params.lowerBound}
                    onChange={(e) => setParams({...params, lowerBound: e.target.value})}
                />
                <Form.Control 
                    id="upperbound-wordcount"
                    placeholder="max"
                    aria-label="max"
                    type="number"
                    value={params.upperBound}
                    onChange={(e) => setParams({...params, upperBound: e.target.value})}
                />
            </div>
        )
    }

    // CLICKING BOOK TOGGLES .ACTIVE FOR HOME NAV (also occurs on page load)
    useEffect(() => {
        handleBookClick();
    }, [])
    const handleBookClick = () => {
        let element = document.getElementById("page-brand");
        element.click();
    }

    // HANDLE EDIT TOGGLE
    const handleEditToggle = () => {
        setModes({...modes, editMode: !modes.editMode});
        let element = document.getElementById("root");
        element.classList.toggle("active");
    }

    // HIDING SEARCHBAR IN MENU
    const [expanded, setExpanded] = useState(false);
    const [searchVisible, setSearchVisible] = useState(true);
    const [cardModeVisible, setCardModeVisible] = useState(true);
    const expandBreakpoint = "md"; // standard navbar md+, collapses at sm
    const BREAKPOINTS = { 1: 0, 2: 576, 3: 768, 4: 992, 5: 1200, 6: 1400 } // xs, sm, md, lg, xl, xxl
    const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS)
    useEffect(() => {
        if((breakpoint <= 2 && expanded) || location.pathname==="/") { // narrow screen + menu open OR on home page
            setSearchVisible(false);
        }
        else { // wide screen, narrow screen + menu closed, not on home page
            setExpanded(false); // ISSUE: causes navbar to 'scrunch' when resizing window w/ menu open
            setSearchVisible(true);
        }

        if(breakpoint <= 2) {
            setCardModeVisible(false);
            setModes({...modes, cardMode: true});
        }
        else {
            setCardModeVisible(true);
        }
    }, [breakpoint, expanded, location.pathname]);


    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


    return <Navbar 
        id="library-navbar"
        fixed="top" expand={expandBreakpoint} collapseOnSelect
        expanded={expanded}
        onToggle={() => {setExpanded(!expanded)}}
    >
        <Container id="nav-container">

            <Navbar.Toggle id="toggle" aria-controls="responsive-navbar-group" />
            
            <Navbar.Brand id="book-brand" className="me-auto" as={Link} to="/" href="/" onClick={handleBookClick}><FaBookReader/></Navbar.Brand>
            
            <Navbar.Collapse id="responsive-navbar-group">
                <Nav>
                    <Nav.Link id="page-brand" className="navbar-brand navbar-tab navbar-item" as={Link} to="/" href="/">The Library</Nav.Link>
                    <Nav.Link className="navbar-tab navbar-item" as={Link} to="/fics" href="/fics">Fanfics</Nav.Link>
                    <Nav.Link className="navbar-tab navbar-item" as={Link} to="/books" href="/books">Books</Nav.Link>
                    <Nav.Link className="navbar-tab navbar-item" as={Link} to="/movies" href="/movies">Movies</Nav.Link>
                    <Nav.Link className="navbar-tab navbar-item" as={Link} to="/shows" href="/shows">Shows</Nav.Link>
                </Nav>
            </Navbar.Collapse>

            <Nav className="d-flex ms-auto justify-content-end" style={{visibility:`${(location.pathname !== "/" && searchVisible) ? "visible" : "hidden"}`}}>
                <ListGroup id="nav-icons" className="d-flex justify-content-start" horizontal>
                    { searchVisible && cardModeVisible ? 
                    <ListGroup.Item ><a id="cardMode" className="navbar-item d-flex" onClick={() => setModes({...modes, cardMode: !modes.cardMode})}>
                        {modes.cardMode ? <IoGridOutline/> : <FaList/>} </a></ListGroup.Item> : <></> }
                    <ListGroup.Item ><a id="editMode" className="navbar-item d-flex" onClick={handleEditToggle}>
                        <FaEdit/> </a></ListGroup.Item>
                    <ListGroup.Item ><a id="addMode" className="navbar-item d-flex" onClick={() => setModes({...modes, addMode: true})}>
                        <MdLibraryAdd/> </a></ListGroup.Item>
                </ListGroup>
            </Nav> 
            
            <Form id="search-form" className="d-flex" style={{visibility:`${searchVisible ? "visible" : "hidden"}`}}> 
                <Form.Control
                    id="search-bar"
                    type="search"
                    placeholder="⌕ Search"
                    className="me-2 rounded-pill"
                    aria-label="Search Media"
                    value={params.search}
                    onChange={(e) => setParams({...params, search: e.target.value})}
                />
                <DropdownButton id="search-dropdown" className="d-flex align-items-center" drop="start"
                    title={<IoOptions className="d-flex align-self-center"/>} size="lg">
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
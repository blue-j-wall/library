import { Button, Card, ListGroup, Form, Container, Row, Col } from 'react-bootstrap'

import { FaBookOpen } from "react-icons/fa";
import { MdConstruction } from "react-icons/md";

export default function Landing(props) {

    return <Container className="d-flex flex-column">

        <Card className="landing welcome">
            <Card.Body>
                <Card.Title>Welcome to the Library!</Card.Title>
                <Card.Text>This project was originally conceptualized as a GUI for my 'media spreadsheets'. They contain information on things I’ve read and watched, and they all go back years, making them quite annoying to search through. This website makes it easier to look through the data for myself, and perhaps others in the future as well.</Card.Text>
            </Card.Body>
        </Card>

        <div id="landing-break"><FaBookOpen/> <FaBookOpen/> <FaBookOpen/> <FaBookOpen/> <FaBookOpen/></div>

        <Card className="landing construction">
            <Card.Body>
                <Card.Title><MdConstruction/> UNDER CONSTRUCTION <MdConstruction/></Card.Title>
                <Card.Subtitle>Upcoming features include...</Card.Subtitle>
                <Card.Text>
                    <li>Favoriting entries for easy viewing on the homepage</li>
                    <li>Page for data analysis (eg. pie chart of book genres)</li>
                    <li>More search features</li>
                </Card.Text>
            </Card.Body>
        </Card>

    </Container>
}
import { Button, Card, ListGroup, Form, Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect, useContext } from "react";

import ModeContext from '../contexts/ModeContext.jsx';

const MediaCard = (props) => {

    const { modes, setModes } = useContext(ModeContext);

    const handleEdit = () => {

    }

    const handleDelete = () => {
        
    }
    
    return <Card style={{marginTop: "1rem"}}>
        <ListGroup variant="flush">
            <ListGroup.Item>
                <Card.Title>{props.title}</Card.Title>
                { props.author ? <Card.Subtitle>{props.author}</Card.Subtitle> : <></> }
            </ListGroup.Item>
            { props.genre ? <ListGroup.Item>{props.genre}</ListGroup.Item> : <></> }
            { props.fandoms && props.wordcount ? <ListGroup.Item style={{fontSize: '.8em'}}>
                <Container className="px-0">
                    <Row>
                        <Col>{props.fandoms}</Col>
                        <Col style={{textAlign: 'right'}}>{props.wordcount}</Col>
                    </Row>
                </Container>
            </ListGroup.Item> : <></> }
            { props.comments ? <ListGroup.Item>{props.comments}</ListGroup.Item> : <></> }
            {
                modes.editMode===true ? (
                    <ListGroup horizontal>
                        <Button onClick={handleEdit} variant="secondary">Edit</Button>
                        <Button onClick={handleDelete} variant="danger">Delete</Button>
                    </ListGroup>
                ) : (<></>)
            }
        </ListGroup>
    </Card>

    /*
    const moreTextID = `moreText-${props.id}`

    const [buttonState, showMore] = useState(1);
    const handleShowMore = () => {
        showMore(1 - buttonState);

        const text = document.getElementById(moreTextID);
        if (text.style.display === "none") text.style.display = "block";
        else text.style.display = "none";
    }

    const handleSave = () => {
        alert(`${props.name} has been added to your basket!`);
        const savedCats = JSON.parse(sessionStorage.getItem('savedCatIds')) ?? [];
        savedCats.push(props.id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(savedCats));
        props.apply();
    }

    return <Card style={{margin: "auto", marginTop: "1rem", maxWidth: "15rem"}}>
        {
            buttonState ? ( 
                <Card.Img variant="top" 
                src={`https://raw.githubusercontent.com/CS571-S25/hw5-api-static-content/main/cats/${props.imgIds[0]}`} 
                alt={`${props.name} - ${props.colors[0]} ${props.breed}`} style={{aspectRatio: 1/1}}/>
            ) : (
                <Carousel>
                    {
                        props.imgIds.map(imgId =>
                            <Carousel.Item key={imgId}>
                                <Card.Img variant="top" 
                                src={`https://raw.githubusercontent.com/CS571-S25/hw5-api-static-content/main/cats/${imgId}`} 
                                alt={`${props.name} - ${props.colors[0]} ${props.breed}`} style={{aspectRatio: 1/1}}/>
                            </Carousel.Item>
                        )
                    }
                </Carousel>
            )
        }
        <Card.Title style={{marginLeft:"1rem", marginTop:"1rem"}}>{props.name}</Card.Title>
        <ListGroup variant="flush" id={moreTextID} style={{marginLeft:"1rem", marginTop:"1rem", display:"none"}}>
            <ListGroup.Item>{props.gender}</ListGroup.Item>
            <ListGroup.Item>{props.breed}</ListGroup.Item>
            <ListGroup.Item>{props.age}</ListGroup.Item>
            {props.description ? <ListGroup.Item>{props.description}</ListGroup.Item> : <></>}
      </ListGroup>
        <Card.Body>
            <Button onClick={handleShowMore} style={{marginRight:"1rem"}}>
                {buttonState ? "Show More" : "Show Less"}
            </Button>
            <Button onClick={handleSave} variant="secondary">❤️ Save</Button>
        </Card.Body>
    </Card>
    */
}

export default MediaCard;
import { Button, Card, ListGroup, Form, Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import ModeContext from '../contexts/ModeContext.jsx';

const MediaRow = (props) => {

    const { modes, setModes } = useContext(ModeContext);

    const handleEdit = () => {

    }

    const handleDelete = () => {
        props.delete(props.id, props.title);
    }


    let cols = [<Col key="title" xs={3}>{props.title}</Col>]
    let location = useLocation();
    if (location.pathname == "/fics") { 
        cols.push(<Col key="author" xs={1}>{props.author}</Col>);
        cols.push(<Col key="fandoms" xs={1}>{props.fandoms}</Col>);
        cols.push(<Col key="wordcount" xs={1}>{props.wordcount}</Col>);
    }
    else if (location.pathname == "/books") {
        cols.push(<Col key="author" xs={1}>{props.author}</Col>);
        cols.push(props.genre ? <Col key="genre" xs={2}>{props.genre}</Col> : <Col key="genre" xs={2}></Col>);
    }
    else if (location.pathname == "/movies" || location.pathname == "/shows") {
        cols.push(props.genre ? <Col key="genre" xs={2}>{props.genre}</Col> : <Col key="genre" xs={2}></Col>);
    }
    cols.push(props.comments ? <Col key="comments" xs={3}>{props.comments}</Col> : <Col key="comments" xs={3}></Col>);
    cols.push(
        modes.editMode ? (
            <Col key="buttons" xs={2}>
                <Button onClick={handleEdit} variant="secondary">Edit</Button>
                <Button onClick={handleDelete} variant="danger">Delete</Button>     
            </Col>
        ) : <Col key="null" xs={0}></Col>
    )

    return <Row className="media-row">
        { cols }
    </Row>
  

}

export default MediaRow;
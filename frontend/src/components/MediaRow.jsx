import { Button, Card, ListGroup, Form, Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MediaRow = (props) => {

    let cols = [<Col key="title" xs={3}>{props.title}</Col>]
    let location = useLocation();
    if (location.pathname == "/fics") { 
        cols.push(<Col key="author" xs={2}>{props.author}</Col>);
        cols.push(<Col key="fandoms" xs={2}>{props.fandoms}</Col>);
        cols.push(<Col key="wordcount" xs={1}>{props.wordcount}</Col>);
    }
    else if (location.pathname == "/books") {
        cols.push(<Col key="author" xs={2}>{props.author}</Col>);
        cols.push(props.genre ? <Col key="genre" xs={3}>{props.genre}</Col> : <Col key="genre" xs={3}></Col>);
    }
    else if (location.pathname == "/movies" || location.pathname == "/shows") {
        cols.push(props.genre ? <Col key="genre" xs={3}>{props.genre}</Col> : <Col key="genre" xs={3}></Col>);
    }
    cols.push(props.comments ? <Col key="comments" xs={4}>{props.comments}</Col> : <Col key="comments" xs={4}></Col>);

    return <Row>
        { cols }
    </Row>
  

}

export default MediaRow;
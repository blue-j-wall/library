import { Button, Card, ListGroup, Form, Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MediaRow = (props) => {

    let cols = [<Col key="title">{props.title}</Col>]
    let location = useLocation();
    if (location.pathname == "/fics") { 
        cols.push(<Col key="author">{props.author}</Col>);
        cols.push(<Col key="fandoms">{props.fandoms}</Col>);
        cols.push(<Col key="wordcount">{props.wordcount}</Col>);
    }
    else if (location.pathname == "/books") {
        cols.push(<Col key="author">{props.author}</Col>);
        cols.push(props.genre ? <Col key="genre">{props.genre}</Col> : <Col key="genre"></Col>);
    }
    else if (location.pathname == "/movies" || location.pathname == "/shows") {
        cols.push(props.genre ? <Col key="genre">{props.genre}</Col> : <Col key="genre"></Col>);
    }
    cols.push(props.comments ? <Col key="comments">{props.comments}</Col> : <Col key="comments"></Col>);

    return <Row>
        { cols }
    </Row>
  

}

export default MediaRow;
import { Button, Card, ListGroup, Form, Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import { MdEdit, MdDelete } from "react-icons/md";

import ModeContext from '../contexts/ModeContext.jsx';
import ActiveEntryContext from '../contexts/ActiveEntryContext.jsx';

const MediaRow = (props) => {

    const { modes, setModes } = useContext(ModeContext);
    const { activeEntry, setActiveEntry } = useContext(ActiveEntryContext);

    const handleEdit = () => { // activates editModal
        setActiveEntry({
            id: props.id,
            title: props.title,
            author: props.author,
            fandoms: props.fandoms,
            wordcount: props.wordcount,
            comments: props.comments,
            link: props.link,
            genre: props.genre
        });
        props.edit();
    }

    const handleDelete = () => { // activates deleteModal
        props.delete(props.id, props.title);
    }


    
    let cols = [<Col key="title" xs={2}>{props.title}</Col>]
    let location = useLocation();
    if (location.pathname == "/fics") { 
        cols.push(<Col key="author" xs={2}>{props.author}</Col>);
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
    cols.push(props.comments ? <Col key="comments" xs={6}>{props.comments}</Col> : <Col key="comments" xs={3}></Col>);
    cols.push(
        modes.editMode ? (
            <Col key="buttons" xs={2}>
                <div id="card-icons" className="d-flex justify-content-end">
                    <a onClick={handleEdit}><MdEdit/></a>
                    <a onClick={handleDelete}><MdDelete/></a>
                </div>
            </Col>
        ) : <Col key="null" xs={0}></Col>
    )

    return <Card className="media-row-outer"><Card className="media-row-inner"><Row>
        { cols }
    </Row></Card></Card>

}

export default MediaRow;
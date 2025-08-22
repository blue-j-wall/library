import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Pagination, Modal, Button } from 'react-bootstrap'

import MediaCard from "../../MediaCard.jsx";
import MediaRow from "../../MediaRow.jsx";
import SearchContext from '../../../contexts/SearchContext.jsx';
import ModeContext from '../../../contexts/ModeContext.jsx';

export default function BookLibrary(props) {

    const [media, setMedia] = useState([])
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [page, setPage] = useState(1);
    const [activeEntry, setActiveEntry] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { params, setParams } = useContext(SearchContext);
    const { modes, setModes } = useContext(ModeContext);

    async function load() {
        const resp = await fetch("http://localhost:53706/api/media?type=Books")
        let data = await resp.json();
        setMedia(data);
        setFilteredMedia(data);
        setParams({...params, search: ""}) // reset search
        document.getElementById("search-bar").value = ""; // reset search
    }

    useEffect(() => {
        load();
    }, []);

    const handleHideDeleteModal = () => {
        setActiveEntry([]);
        setShowDeleteModal(false);
    }
    const handleShowDeleteModal = (entryID, entryTitle) => {
        setActiveEntry([entryID, entryTitle]);
        setShowDeleteModal(true);
    }
    async function handleDelete() {
        let id = activeEntry[0];
        const resp = await fetch(`http://localhost:53706/api/media?type=Books&id=${id}`, {
            method: "DELETE"
        })
        if (resp.ok) {
            handleHideDeleteModal();
            load();
        }
        else {
            alert("Something went wrong.")
        }
    }

    const handleEdit = (entryID) => {
    }

    // SEARCH
    useEffect(() => {

        setPage(1);

        let paramList = params.search.split(/(\s+)/).filter(p => p !== " " && p !== "")
        let filteredLists = [] // array of arrays

        if(paramList.length > 0) {
            for(let param of paramList) {

                let filterTitle = []
                if(params.title) {
                    filterTitle = media.filter(m => `${m.title.toLowerCase()}`.includes(param));
                }
                 
                let filterAuthor = []
                if(params.author) { // have to account for this eventually being an array; flatten to string
                    filterAuthor = media.filter(m => `${m.author.toLowerCase()}`.includes(param));
                }

                let filterGenre = []
                if(params.genre) { // have to account for this eventually being an array
                    filterGenre = media.filter(m => m.genre != null).filter(m => `${m.genre.toLowerCase()}`.includes(param)); 
                }

                let filterComments = []
                if(params.comments) {
                    filterComments = media.filter(m => m.comments != null).filter(m => `${m.comments?.toLowerCase()}`.includes(param));
                } 
                    
                filteredLists.push([...new Set([...filterTitle, ...filterAuthor, ...filterGenre, ...filterComments])]); // OR
            }

            let intersection = filteredLists[0]
            for(let list of filteredLists) {
                intersection = intersection.filter(value => list.includes(value)); // AND
            }
            setFilteredMedia(intersection);
        }
        else {
            setFilteredMedia(media);
        }
        
    }, [params]);

    // PAGINATION
    const numPages = 24;
    const pages = [];
    if(filteredMedia.length <= numPages) {
        pages.push(<Pagination.Item onClick={() => setPage(1)} active={page === 1} key={1}>{1}</Pagination.Item>);
    }
    else {
        if(page !== 1) {
            pages.push(<Pagination.Item onClick={() => setPage(page-1)} active={page === page-1} key={"previous"}>Previous</Pagination.Item>);
        }
        for (let i=1; i <= Math.ceil(filteredMedia.length/numPages); i++) {
            pages.push(<Pagination.Item onClick={() => setPage(i)} active={page === i} key={i}>{i}</Pagination.Item>);
        }
        if(page !== Math.ceil(filteredMedia.length/numPages)) {
            pages.push(<Pagination.Item onClick={() => setPage(page+1)} active={page === page+1} key={"next"}>Next</Pagination.Item>);
        }
    }

    return <>
        <Container>
        <Row>
            {
                modes.viewRadio == "card" ? <>{
                    filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                    <Col key={m.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                        <MediaCard {...m} delete={handleShowDeleteModal} edit={handleEdit}/>
                    </Col>
                )}</> : <>
                {/* // header - loads before the list
                    <Col xl={12}><Row>
                        <Col xs={3}><strong>Title</strong></Col>
                        <Col xs={2}><strong>Author</strong></Col>
                        <Col xs={3}><strong>Genre</strong></Col>
                        <Col xs={4}><strong>Comments</strong></Col>
                    </Row></Col>
                */}
                {
                    filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                    <Col key={m.id} xl={12}>
                        <MediaRow {...m} delete={handleShowDeleteModal} edit={handleEdit}/>
                    </Col>
                )}</>
            }
        </Row>
        </Container>
        { pages.length>1 ? <><br/><Pagination> {pages} </Pagination></> : <></> }

        <Modal show={showDeleteModal} onHide={handleHideDeleteModal} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>Delete the entry "{activeEntry[1]}"?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHideDeleteModal}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </Modal.Footer>
        </Modal> 
    </>
}
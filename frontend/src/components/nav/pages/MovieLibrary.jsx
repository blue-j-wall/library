import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Pagination, Form } from 'react-bootstrap'

import MediaCard from "../../MediaCard.jsx";
import SearchContext from '../../../contexts/SearchContext.jsx';

export default function MovieLibrary(props) {

    const [media, setMedia] = useState([])
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [page, setPage] = useState(1);
    const { params, setParams } = useContext(SearchContext);

    async function load() {
        const resp = await fetch("http://localhost:53706/api/movies")
        let data = await resp.json();
        setMedia(data);
        setFilteredMedia(data);
        setParams({...params, search: ""}) // reset search
        document.getElementById("search-bar").value = ""; // reset search
    }

    useEffect(() => {
        load();
    }, []);

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

                let filterGenre = []
                if(params.genre) { // have to account for this eventually being an array
                    filterGenre = media.filter(m => m.genre != null).filter(m => `${m.genre.toLowerCase()}`.includes(param)); 
                }

                let filterComments = []
                if(params.comments) {
                    filterComments = media.filter(m => m.comments != null).filter(m => `${m.comments?.toLowerCase()}`.includes(param));
                } 
                    
                filteredLists.push([...new Set([...filterTitle, ...filterGenre, ...filterComments])]); // OR
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
                filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                <Col key={m.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                    <MediaCard {...m}/>
                </Col>
                )
            }
        </Row>
        </Container>
        { pages.length>1 ? <><br/><Pagination> {pages} </Pagination></> : <></> }
    </>
}
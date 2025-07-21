import { useEffect, useState } from 'react'
import { Container, Row, Col, Pagination } from 'react-bootstrap'

import MediaCard from "../../MediaCard.jsx";

export default function MovieLibrary(props) {

    const [media, setMedia] = useState([])
    const [page, setPage] = useState(1)

    async function load() {
        const resp = await fetch("http://localhost:53706/api/movies")
        let data = await resp.json();
        setMedia(data)
    }

    useEffect(() => {
        load();
    }, []);

    // PAGINATION
    const numPages = 24;
    const pages = [];
    if(media.length <= numPages) {
        pages.push(<Pagination.Item onClick={() => setPage(1)} active={page === 1} key={1}>{1}</Pagination.Item>);
    }
    else {
        if(page !== 1) {
            pages.push(<Pagination.Item onClick={() => setPage(page-1)} active={page === page-1} key={"previous"}>Previous</Pagination.Item>);
        }
        for (let i=1; i <= Math.ceil(media.length/numPages); i++) {
            pages.push(<Pagination.Item onClick={() => setPage(i)} active={page === i} key={i}>{i}</Pagination.Item>);
        }
        if(page !== Math.ceil(media.length/numPages)) {
            pages.push(<Pagination.Item onClick={() => setPage(page+1)} active={page === page+1} key={"next"}>Next</Pagination.Item>);
        }
    }

    return <>
        <Container>
        <Row>
            {
                media.slice(((page) - 1) * numPages, page * numPages).map(m => 
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
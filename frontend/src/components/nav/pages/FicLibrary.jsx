import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Pagination, Form, Image } from 'react-bootstrap'

import MediaCard from "../../MediaCard.jsx";
import MediaRow from "../../MediaRow.jsx";
import SearchContext from '../../../contexts/SearchContext.jsx';

export default function FicLibrary(props) {

    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [page, setPage] = useState(1);
    const { params, setParams } = useContext(SearchContext);

    async function load() {
        const resp = await fetch("http://localhost:53706/api/fics")
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

        let radioFilter = media; // single/multichap filtering
        if(params.chapterRadio == "multi") { 
            radioFilter = media.filter(m => `${m.link.toLowerCase()}`.includes("chapter"));
        }
        else if(params.chapterRadio == "single") {
            radioFilter = media.filter(m => !`${m.link.toLowerCase()}`.includes("chapter"));
        }

        // have to do error-checking for the wordcount range
        // lower < upper --> will not do search if lower > upper
        // lower + empty string is lower and above
        // upper + empty string is upper and below

        if(paramList.length > 0) {
            for(let param of paramList) {

                let filterTitle = []
                if(params.title) {
                    filterTitle = radioFilter.filter(m => `${m.title.toLowerCase()}`.includes(param));
                }
                 
                let filterAuthor = []
                if(params.author) { // have to account for this eventually being an array; flatten to string
                    filterAuthor = radioFilter.filter(m => `${m.author.toLowerCase()}`.includes(param));
                }

                let filterFandoms = []
                if(params.fandoms) { // have to account for this eventually being an array
                    filterFandoms = radioFilter.filter(m => `${m.fandoms.toLowerCase()}`.includes(param)); 
                }

                let filterComments = []
                if(params.comments) {
                    filterComments = radioFilter.filter(m => m.comments != null).filter(m => `${m.comments?.toLowerCase()}`.includes(param));
                } 
                    
                filteredLists.push([...new Set([...filterTitle, ...filterAuthor, ...filterFandoms, ...filterComments])]); // OR
            }

            let intersection = filteredLists[0] // get intersection of the results for each search term
            for(let list of filteredLists) { 
                intersection = intersection.filter(value => list.includes(value)); // AND
            }

            setFilteredMedia(intersection);
        }
        else {
            setFilteredMedia(radioFilter);
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
                params.viewRadio == "card" ? <>{
                    filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                    <Col key={m.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                        <MediaCard {...m}/>
                    </Col>
                )}</> : <>{
                    filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                    <Col key={m.id} xl={12}>
                        <MediaRow {...m}/>
                    </Col>
                )}</>
            }
        </Row>
        </Container>
        { pages.length>1 ? <><br/><Pagination> {pages} </Pagination></> : <></> }

    </>
}
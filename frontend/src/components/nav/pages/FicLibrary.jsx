import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Pagination, Modal, Button } from 'react-bootstrap'

import MediaCard from "../../MediaCard.jsx";
import MediaRow from "../../MediaRow.jsx";
import DeleteModal from '../../DeleteModal.jsx';
import AddModal from '../../AddModal.jsx';
import SearchContext from '../../../contexts/SearchContext.jsx';
import ModeContext from '../../../contexts/ModeContext.jsx';
import ActiveEntryContext from '../../../contexts/ActiveEntryContext.jsx';

export default function FicLibrary(props) {

    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const { params, setParams } = useContext(SearchContext);
    const { modes, setModes } = useContext(ModeContext);
    const { activeEntry, setActiveEntry } = useContext(ActiveEntryContext);

    async function load() {
        const resp = await fetch("http://localhost:53706/api/media?type=Fics")
        let data = await resp.json();
        setMedia(data);
        setFilteredMedia(data);
        setParams({...params, search: ""}) // reset search
        document.getElementById("search-bar").value = ""; // reset search
        setModes({...modes, addMode: false}) // so it doesn't pop up between pages
    }

    useEffect(() => {
        load();
    }, []);

    const resetActiveEntry = () => {
        setActiveEntry({
            id: null,
            title: null,
            author: null,
            fandoms: null,
            wordcount: null,
            comments: null,
            link: null,
            genre: null
        });
    }

    // HANDLE SPECIFIC ENTRY DELETION
    const handleHideDeleteModal = () => {
        resetActiveEntry();
        setShowDeleteModal(false);
    }
    const handleShowDeleteModal = (entryID, entryTitle) => {
        resetActiveEntry();
        setActiveEntry({...activeEntry, id: entryID, title: entryTitle})
        setShowDeleteModal(true);
    }
    async function handleDelete() {
        const resp = await fetch(`http://localhost:53706/api/media?type=Fics&id=${activeEntry.id}`, {
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

    // HANDLE ADD MODE (trigger-button is on the Navbar)
    const handleHideAddModal = () => {
        setModes({...modes, addMode:false});
    }
    useEffect(() => {
        resetActiveEntry();
        setShowAddModal(modes.addMode);
    }, [modes.addMode])
    async function handleAdd(entry) { // should take Object formatted like activeEntry

        console.log(entry);

        // make activeEntry into new entry
        // call SQL that pulls item from Movies where id is the highest in the table
        //   then +1 and set new Entry's id to that
        
    }

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

        let wcFilter = radioFilter // wordcount range filter
        let min = params.lowerBound ? parseInt(params.lowerBound) : 0
        let max = params.upperBound ? parseInt(params.upperBound) : Number.MAX_VALUE
        // if min > max --> simply do not filter
        if(min <= max) {
            wcFilter = radioFilter.filter(m => m.wordcount >= min && m.wordcount <= max);
        }
        
        if(paramList.length > 0) {
            for(let param of paramList) {

                let filterTitle = []
                if(params.title) {
                    filterTitle = wcFilter.filter(m => `${m.title.toLowerCase()}`.includes(param));
                }
                 
                let filterAuthor = []
                if(params.author) { // have to account for this eventually being an array; flatten to string
                    filterAuthor = wcFilter.filter(m => `${m.author.toLowerCase()}`.includes(param));
                }

                let filterFandoms = []
                if(params.fandoms) { // have to account for this eventually being an array
                    filterFandoms = wcFilter.filter(m => `${m.fandoms.toLowerCase()}`.includes(param)); 
                }

                let filterComments = []
                if(params.comments) {
                    filterComments = wcFilter.filter(m => m.comments != null).filter(m => `${m.comments?.toLowerCase()}`.includes(param));
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
            setFilteredMedia(wcFilter);
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
        <Container style={{wordBreak: 'break-all'}}>
        <Row>
            {
                modes.viewRadio == "card" ? <>{
                    filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                    <Col key={m.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                        <MediaCard {...m} delete={handleShowDeleteModal} edit={handleEdit}/>
                    </Col>
                )}</> : <>{
                    /* // header - loads before the list
                        <Col xs={12}><Row>
                            <Col xs={3}><strong>Title</strong></Col>
                            <Col xs={2}><strong>Author</strong></Col>
                            <Col xs={2}><strong>Fandoms</strong></Col> 
                            <Col xs={1}><strong>Word#</strong></Col>
                            <Col xs={4}><strong>Comments</strong></Col>
                        </Row></Col>
                    */
                
                    filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                    <Col key={m.id} xs={12}>
                        <MediaRow {...m} delete={handleShowDeleteModal} edit={handleEdit}/>
                    </Col>)
                }</>
            }
        </Row>
        </Container>
        { pages.length>1 ? <><br/><Pagination> {pages} </Pagination></> : <></> }

        <DeleteModal show={showDeleteModal} hide={handleHideDeleteModal} delete={handleDelete} title={activeEntry.title}/>

        <AddModal show={showAddModal} hide={handleHideAddModal} add={handleAdd} type="Fics"/>

    </>
}
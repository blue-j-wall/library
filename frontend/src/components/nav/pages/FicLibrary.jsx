import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Pagination, Modal, Button } from 'react-bootstrap'

import useBreakpoint from 'use-breakpoint';

import MediaCard from "../../MediaCard.jsx";
import MediaRow from "../../MediaRow.jsx";
import DeleteModal from '../../DeleteModal.jsx';
import AddModal from '../../AddModal.jsx';
import EditModal from '../../EditModal.jsx';
import SearchContext from '../../../contexts/SearchContext.jsx';
import ModeContext from '../../../contexts/ModeContext.jsx';
import ActiveEntryContext from '../../../contexts/ActiveEntryContext.jsx';

export default function FicLibrary(props) {

    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [page, setPage] = useState(1);
    const [cardCols, setCardCols] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { params, setParams } = useContext(SearchContext);
    const { modes, setModes } = useContext(ModeContext);
    const { activeEntry, setActiveEntry } = useContext(ActiveEntryContext);

    async function load() {
        const resp = await fetch("http://localhost:53706/api/media?type=Fics");
        let data = await resp.json();
        setMedia(data);
        setFilteredMedia(data);
        setParams({...params, search: ""}); // reset search
        document.getElementById("search-bar").value = ""; // reset search
        setModes({...modes, addMode: false}); // so it doesn't pop up between pages
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

    // HANDLE SPECIFIC ENTRY EDITING
    const handleHideEditModal = () => {
        resetActiveEntry();
        setShowEditModal(false);
    }
    const handleShowEditModal = () => {
        setShowEditModal(true);
    }
    async function handleEdit(editedEntry) {
        const resp = await fetch("http://localhost:53706/api/media?type=Fics", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                entry: editedEntry
            })
        })
        if(resp.ok) {
            handleHideEditModal();
            load();
        }
        else {
            alert("Something went wrong.")
        }
    }

    // HANDLE ADD MODE (trigger-button is on the Navbar)
    const handleHideAddModal = () => {
        setModes({...modes, addMode:false});
    }
    useEffect(() => {
        resetActiveEntry();
        setShowAddModal(modes.addMode);
    }, [modes.addMode])
    async function handleAdd(newEntry) { // should take Object formatted like activeEntry

        const resp = await fetch("http://localhost:53706/api/media?type=Fics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                entry: newEntry
            })
        })
        if(resp.ok) {
            handleHideAddModal();
            load();
        }
        else {
            alert("Something went wrong.")
        }
    }

    // SEARCH
    useEffect(() => {

        setPage(1);

        let paramList = params.search.split(/(\s+)/).filter(p => p !== " " && p !== "")
        let filteredLists = [] // array of arrays

        // single/multichap filtering (only works w/ ao3 links)
        let radioFilter = media; 
        if(params.chapterRadio == "multi") { 
            radioFilter = media.filter(m => `${m.link?.toLowerCase()}`.includes("chapter"));
        }
        else if(params.chapterRadio == "single") {
            radioFilter = media.filter(m => `${m.link?.toLowerCase()}`.includes("archiveofourown") 
                                                && !`${m.link?.toLowerCase()}`.includes("chapter"));
        }

        // wordcount range filtering
        let wcFilter = radioFilter;
        let min = Number.MAX_VALUE-1;
        let max = 0;
        if(params.lowerBound || params.upperBound) {
            min = params.lowerBound ? parseInt(params.lowerBound) : 0;
            max = params.upperBound ? parseInt(params.upperBound) : Number.MAX_VALUE-1;
        }
        // if min > max (no or ill-formatted input) --> simply do not filter
        if(min <= max) {
            wcFilter = radioFilter.filter(m => (m.wordcount ?? min-1) >= min && (m.wordcount ?? max+1) <= max);
        }
        
        // search bar params filtering
        if(paramList.length > 0) {
            for(let param of paramList) {

                let filterTitle = []
                if(params.title) {
                    filterTitle = wcFilter.filter(m => `${m.title.toLowerCase()}`.includes(param.toLowerCase()));
                }
                 
                let filterAuthor = []
                if(params.author) { // have to account for this eventually being an array; flatten to string
                    filterAuthor = wcFilter.filter(m => `${m.author?.toLowerCase()}`.includes(param.toLowerCase()));
                }

                let filterFandoms = []
                if(params.fandoms) { // have to account for this eventually being an array
                    filterFandoms = wcFilter.filter(m => `${m.fandoms?.toLowerCase()}`.includes(param.toLowerCase())); 
                }

                let filterComments = []
                if(params.comments) {
                    filterComments = wcFilter.filter(m => m.comments != null).filter(m => `${m.comments?.toLowerCase()}`.includes(param.toLowerCase()));
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
    const handlePageChange = (num) => {
        setPage(num);
        setTimeout(function () {
            window.scrollTo(0, 0);
        }, 1);
    }

    const numPages = 24;
    const pages = [];
    if(filteredMedia.length <= numPages) {
        pages.push(<Pagination.Item className="page-item" 
            onClick={() => handlePageChange(1)} active={page === 1} key={1}>{1}</Pagination.Item>);
    }
    else {
        if(page !== 1) {
            pages.push(<Pagination.Item className="page-item" 
                onClick={() => handlePageChange(page-1)} active={page === page-1} key={"previous"}>Previous</Pagination.Item>);
        }
        for (let i=1; i <= Math.ceil(filteredMedia.length/numPages); i++) {
            pages.push(<Pagination.Item className="page-item" 
                onClick={() => handlePageChange(i)} active={page === i} key={i}>{i}</Pagination.Item>);
        }
        if(page !== Math.ceil(filteredMedia.length/numPages)) {
            pages.push(<Pagination.Item className="page-item" 
                onClick={() => handlePageChange(page+1)} active={page === page+1} key={"next"}>Next</Pagination.Item>);
        }
    }

    // RESPONSIVE TUMBLR-STYLE COLUMN BEHAVIOR
    const BREAKPOINTS = { 1: 0, 2: 576, 3: 768, 4: 992, 5: 1200, 6: 1400 } // xs, sm, md, lg, xl, xxl
    const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS)
    function includeInCol(id, colNum) {
        let include = false;
        /*
            xl              lg              md              sm
            col1 id%4===1   col1 id%3===1   col1 id%3===1   col1 true
            col2 id%4===2   col2 id%3===2   col2 id%3===0   col2 false
            col3 id%4===3   col3 id%3===0   col3 false      col3 false
            col4 id%4===0   col4 false      col4 false      col4 false        
        */
        if(breakpoint >= 5) {
            switch(colNum) {
                case 1:
                    include = (id%4===1);
                    break;
                case 2:
                    include = (id%4===2);
                    break;
                case 3:
                    include = (id%4===3);
                    break;
                case 4:
                    include = (id%4===0);
                    break;
            }
        }
        else if(breakpoint == 4) {
            switch(colNum) {
                case 1:
                    include = (id%3===1);
                    break;
                case 2:
                    include = (id%3===2);
                    break;
                case 3:
                    include = (id%3===0);
                    break;
            }
        }
        else if(breakpoint == 3) {
            switch(colNum) {
                case 1:
                    include = (id%2===1);
                    break;
                case 2:
                    include = (id%2===0);
                    break;
            }
        }
        else if(breakpoint <= 2) {
            if(colNum === 1) include = true;
        }
        else {
            console.log("breakpoint column error");
        } 

        return include;
    }

    const loadCols = () => {
        let numCols = 0;
        if(breakpoint >= 5) numCols = 4;
        else if(breakpoint == 4) numCols = 3;
        else if(breakpoint == 3) numCols = 2;
        else if(breakpoint <= 2) numCols = 1;
        else console.log("breakpoint column error");

        let cols = [];

        for (let i=1; i<=numCols; i++) {
            cols.push(
                <Col key={i} xs={12} sm={12} md={6} lg={4} xl={3}>
                    {filteredMedia.slice(((page) - 1) * numPages, page * numPages).filter((m, index) => includeInCol(index+1, i)).map(m => 
                        <MediaCard key={m.id} {...m} delete={handleShowDeleteModal} edit={handleShowEditModal}/>
                    )}
                </Col>
            );
        }

        setCardCols(cols);
    }
    useEffect(() => {
        loadCols();
    }, [breakpoint, page, filteredMedia]);
  
    return <>
        <Container>
        {
            media[0] ? 
            <Row>
                { 
                    modes.cardMode ? <>{ cardCols }</> : 
                    <>{
                        filteredMedia.slice(((page) - 1) * numPages, page * numPages).map(m => 
                        <Col key={m.id} xs={12}>
                            <MediaRow {...m} delete={handleShowDeleteModal} edit={handleShowEditModal}/>
                        </Col>)
                    }</>
                }
            </Row> :
            <h1 className="no-entries-message">No fics to display!</h1>
        }
        </Container>
        { pages.length>1 ? <div className="footer d-flex justify-content-end">
            <Pagination> {pages} </Pagination>
        </div> : <></> }

        <DeleteModal show={showDeleteModal} hide={handleHideDeleteModal} confirm={handleDelete} title={activeEntry.title}/>

        <AddModal show={showAddModal} hide={handleHideAddModal} confirm={handleAdd} type="Fics"/>

        <EditModal show={showEditModal} hide={handleHideEditModal} confirm={handleEdit} type="Fics"/>

    </>
}
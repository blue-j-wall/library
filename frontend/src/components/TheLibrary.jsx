import './TheLibrary.css'
import { useEffect, useState, useContext } from 'react'
import { Outlet } from "react-router-dom";

import PageNavbar from "./nav/Navbar";
import SearchContext from "../contexts/SearchContext"
import ModeContext from "../contexts/ModeContext"
import ActiveEntryContext from "../contexts/ActiveEntryContext"

function TheLibrary() {
  //TODO: MAYBE COULD LOAD FAVES? that's the only thing that would need to be passed between pages
  // (would require this 'pre-loading' and placing into a DataContext)

  const [params, setParams] = useState({
    search: '', // search field

    title: true, // checkbox values
    author: true,
    fandoms: true,
    genre: true,
    comments: true, 
  
    chapterRadio: "all", // option for single/multi chapter

    upperBound: "", // wordcount range
    lowerBound: "",
  });
  const searchValue = { params, setParams };

  const [modes, setModes] = useState({
    viewRadio: "card", // option for card/list view

    editMode: false, // option for edit/delete mode (site-wide)
    addMode: false // whether 'add new entry' modal is active or not
  });
  const modeValue = { modes, setModes };

  const [activeEntry, setActiveEntry] = useState({
    id: null,
    title: null,
    author: null,
    fandoms: null,
    wordcount: null,
    comments: null,
    link: null,
    genre: null
  });
  const entryValue = { activeEntry, setActiveEntry };

  return <>
    <SearchContext.Provider value={searchValue}>
    <ModeContext.Provider value={modeValue}>
    <ActiveEntryContext.Provider value={entryValue}>
      <PageNavbar />
      <br></br>
      <Outlet />
    </ActiveEntryContext.Provider>
    </ModeContext.Provider>
    </SearchContext.Provider>
  </>
}

export default TheLibrary

import './TheLibrary.css'
import { useEffect, useState, useContext } from 'react'
import { Outlet } from "react-router-dom";

import PageNavbar from "./nav/Navbar";
import SearchContext from "../contexts/SearchContext"
import ModeContext from "../contexts/ModeContext"

function TheLibrary() {
  //TODO: MAYBE COULD LOAD FAVES? that's the only thing that would need to be passed between pages
  // (would require this 'pre-loading' and placing into a DataContext)
  /*
  const [media, setMedia] = useState([])

  async function load() {
    const resp = await fetch("http://localhost:53706/api/fics")
    let data = await resp.json();
    setMedia(data)
    console.log(media)
  }

  useEffect(() => {
    load();
  }, []);
  */

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

    editMode: false // option for edit/delete mode (site-wide)
  });
  const modeValue = { modes, setModes };

  return <>
    <SearchContext.Provider value={searchValue}>
    <ModeContext.Provider value={modeValue}>
      <PageNavbar />
      <br></br>
      <Outlet />
    </ModeContext.Provider>
    </SearchContext.Provider>
  </>
}

export default TheLibrary

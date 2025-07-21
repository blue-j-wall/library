import './TheLibrary.css'
import { useEffect, useState, useContext } from 'react'
import { Outlet } from "react-router-dom";

import Navbar from "./nav/Navbar";
import SearchContext from "../contexts/SearchContext"

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
    comments: true});
  const value = { params, setParams };

  return <>
    <SearchContext.Provider value={value}>
      <Navbar />
      <br></br>
      <Outlet />
    </SearchContext.Provider>
  </>
}

export default TheLibrary

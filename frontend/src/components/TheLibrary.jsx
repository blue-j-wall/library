import './TheLibrary.css'
import { Outlet } from "react-router-dom";

import Navbar from "./nav/Navbar";

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

  return <>
    <Navbar />
    <br></br>
    <Outlet />
  </>
}

export default TheLibrary

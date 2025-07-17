import { useEffect, useState } from 'react'
import './App.css'
import { Button, Card, Form } from 'react-bootstrap'


function App() {
  
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

  return (
      <>
        <div>
          <h1>Welcome to... my website! :3</h1>
        </div>

        
      </>
  )
}

export default App

import { useEffect, useState } from 'react'
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap'
import { Outlet } from "react-router-dom";

export default function FicLibrary(props) {

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

    return <>

        
        <Container>
        <Row>
            {
                media.map(m => 
                <Col key={m.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                    <Card style={{marginTop: "1rem"}}>
                    <p><strong>{m.title}</strong></p>
                    </Card>
                </Col>
                )
            }
        </Row>
        </Container>
            
    </>
}
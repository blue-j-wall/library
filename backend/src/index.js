// !!! IMPORTANT !!!
// Be sure to run 'npm run dev' from a
// terminal in the 'backend' directory!

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'

import { applyRateLimiting, applyLooseCORSPolicy, applyBodyParsing, applyLogging, applyErrorCatching } from './api-middleware.js'

const app = express();
const port = 53706;


const GET_FIC_SQL = 'SELECT * FROM Fics;'
const GET_BOOK_SQL = 'SELECT * FROM Books;'
const GET_MOVIE_SQL = 'SELECT * FROM Movies;'
const GET_SHOW_SQL = 'SELECT * FROM Shows;'
/*
const GET_SPECIFIC_POST_SQL = 'SELECT * FROM BadgerComment WHERE id = ?;'
const INSERT_POST_SQL = 'INSERT INTO BadgerComment(comment, created) VALUES (?, ?) RETURNING id;'
const DELETE_POST_SQL = "DELETE FROM BadgerComment WHERE id = ?;"
*/

const db = await open({
    filename: "./media.db",
    driver: sqlite3.Database
});

await db.exec("CREATE TABLE IF NOT EXISTS Fics(id TEXT PRIMARY KEY UNIQUE, title TEXT NOT NULL, author TEXT, fandoms TEXT, wordcount INTEGER, comments TEXT, link TEXT);")
await db.exec("CREATE TABLE IF NOT EXISTS Books(id TEXT PRIMARY KEY UNIQUE, title TEXT NOT NULL, author TEXT, genre TEXT, comments TEXT);")
await db.exec("CREATE TABLE IF NOT EXISTS Movies(id TEXT PRIMARY KEY UNIQUE, title TEXT NOT NULL, genre TEXT, comments TEXT);")
await db.exec("CREATE TABLE IF NOT EXISTS Shows(id TEXT PRIMARY KEY UNIQUE, title TEXT NOT NULL, genre TEXT, comments TEXT);")

applyRateLimiting(app);
applyLooseCORSPolicy(app);
applyBodyParsing(app);
applyLogging(app);


app.get('/api/fics', async (req, res) => {
    try {
        const ret = await db.all(GET_FIC_SQL);
        res.status(200).send(ret);
    } catch (e) {
        console.error(e);
        res.status(500).send({
            msg: "Something went wrong!"
        });
    }
})

app.get('/api/books', async (req, res) => {
    try {
        const ret = await db.all(GET_BOOK_SQL);
        res.status(200).send(ret);
    } catch (e) {
        console.error(e);
        res.status(500).send({
            msg: "Something went wrong!"
        });
    }
})

app.get('/api/movies', async (req, res) => {
    try {
        const ret = await db.all(GET_MOVIE_SQL);
        res.status(200).send(ret);
    } catch (e) {
        console.error(e);
        res.status(500).send({
            msg: "Something went wrong!"
        });
    }
})

app.get('/api/shows', async (req, res) => {
    try {
        const ret = await db.all(GET_SHOW_SQL);
        res.status(200).send(ret);
    } catch (e) {
        console.error(e);
        res.status(500).send({
            msg: "Something went wrong!"
        });
    }
})

/*
app.post('/api/comments', async (req, res) => {
    const comment = req.body.comment;

    if (!comment) {
        res.status(400).send({
            msg: "You must specify a comment!"
        })
    } else {
        try {
            const ret = await db.get(INSERT_POST_SQL, comment, new Date());
            res.status(200).send({
                msg: "Successfully posted!",
                id: ret.id
            })
        } catch (e) {
            console.error(e);
            res.status(500).send({
                msg: "Something went wrong!"
            });
        }
    }
})

app.delete('/api/comments', async (req, res) => {
    const commentId = req.query.id;
    try {
        const d = await db.get(GET_SPECIFIC_POST_SQL, commentId)
        if (d) {
            await db.run(DELETE_POST_SQL, commentId);
            res.status(200).send({
                "msg": "Successfully deleted comment!"
            })
        } else {
            res.status(404).send({
                "msg": "That comment was not found!"
            })
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({
            msg: "Something went wrong!"
        })
    }
    
});
*/

applyErrorCatching(app);

// Open server for business!
app.listen(port, () => {
    console.log(`My API has been opened on :${port}`)
});

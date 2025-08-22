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

const GET_FIC_ENTRY_SQL = 'SELECT * FROM Fics WHERE id = ?;'
const GET_BOOK_ENTRY_SQL = 'SELECT * FROM Books WHERE id = ?;'
const GET_MOVIE_ENTRY_SQL = 'SELECT * FROM Movies WHERE id = ?;'
const GET_SHOW_ENTRY_SQL = 'SELECT * FROM Shows WHERE id = ?;'

const DEL_FIC_ENTRY_SQL = 'DELETE FROM Fics WHERE id = ?;'
const DEL_BOOK_ENTRY_SQL = 'DELETE FROM Books WHERE id = ?;'
const DEL_MOVIE_ENTRY_SQL = 'DELETE FROM Movies WHERE id = ?;'
const DEL_SHOW_ENTRY_SQL = 'DELETE FROM Shows WHERE id = ?;'

//const INSERT_POST_SQL = 'INSERT INTO BadgerComment(comment, created) VALUES (?, ?) RETURNING id;'

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

// LOAD ENTRIES
app.get('/api/media', async (req, res) => {
    const table = req.query.type;
    try {
        switch(table) {
        case "Fics":
            var ret = await db.all(GET_FIC_SQL);
            res.status(200).send(ret);
            break;
        case "Books":
            var ret = await db.all(GET_BOOK_SQL);
            res.status(200).send(ret);
            break;
        case "Movies":
            var ret = await db.all(GET_MOVIE_SQL);
            res.status(200).send(ret);
            break;
        case "Shows":
            var ret = await db.all(GET_SHOW_SQL);
            res.status(200).send(ret);
            break;
        default:
            res.status(404).send({
                "msg": "That table was not found!"
            });
        } 
        
    } catch (e) {
        console.error(e);
        res.status(500).send({
            msg: "Something went wrong!"
        });
    }
})


// DELETE ENTRY
app.delete('/api/media', async (req, res) => {
    const table = req.query.type;
    const entryID = req.query.id;
    try {
        switch(table) {
        case "Fics":
            var d = await db.get(GET_FIC_ENTRY_SQL, entryID)
            if (d) {
                await db.run(DEL_FIC_ENTRY_SQL, entryID);
                res.status(200).send({
                    "msg": "Successfully deleted entry!"
                })
            } else {
                res.status(404).send({
                    "msg": "That entry was not found!"
                })
            }
            break;
        case "Books":
            var d = await db.get(GET_BOOK_ENTRY_SQL, entryID)
            if (d) {
                await db.run(DEL_BOOK_ENTRY_SQL, entryID);
                res.status(200).send({
                    "msg": "Successfully deleted entry!"
                })
            } else {
                res.status(404).send({
                    "msg": "That entry was not found!"
                })
            }
            break;
        case "Movies":
            var d = await db.get(GET_MOVIE_ENTRY_SQL, entryID)
            if (d) {
                await db.run(DEL_MOVIE_ENTRY_SQL, entryID);
                res.status(200).send({
                    "msg": "Successfully deleted entry!"
                })
            } else {
                res.status(404).send({
                    "msg": "That entry was not found!"
                })
            }
            break;
        case "Shows":
            var d = await db.get(GET_SHOW_ENTRY_SQL, entryID)
            if (d) {
                await db.run(DEL_SHOW_ENTRY_SQL, entryID);
                res.status(200).send({
                    "msg": "Successfully deleted entry!"
                })
            } else {
                res.status(404).send({
                    "msg": "That entry was not found!"
                })
            }
            break;
        default:
            res.status(404).send({
                "msg": "That table was not found!"
            });
        } 
    } catch (e) {
        console.error(e);
        res.status(500).send({
            msg: "Something went wrong!"
        })
    }
    
});

// TODO: ADD ENTRY

// TODO: EDIT ENTRY



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

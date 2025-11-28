// !!! IMPORTANT !!!
// Be sure to run 'npm run dev' from a
// terminal in the 'backend' directory!

import express from 'express';
import sqlite3 from 'sqlite3';
import * as cheerio from 'cheerio';
import * as axios from 'axios';
import { open } from 'sqlite'

import { applyRateLimiting, applyLooseCORSPolicy, applyBodyParsing, applyLogging, applyErrorCatching } from './api-middleware.js'

const app = express();
const port = 53706;

// SQL commands
const GET_FICS_TABLE_SQL = 'SELECT * FROM Fics;'
const GET_BOOKS_TABLE_SQL = 'SELECT * FROM Books;'
const GET_MOVIES_TABLE_SQL = 'SELECT * FROM Movies;'
const GET_SHOWS_TABLE_SQL = 'SELECT * FROM Shows;'

const GET_FIC_SQL = 'SELECT * FROM Fics WHERE id = ?;'
const GET_BOOK_SQL = 'SELECT * FROM Books WHERE id = ?;'
const GET_MOVIE_SQL = 'SELECT * FROM Movies WHERE id = ?;'
const GET_SHOW_SQL = 'SELECT * FROM Shows WHERE id = ?;'

const DEL_FIC_SQL = 'DELETE FROM Fics WHERE id = ?;'
const DEL_BOOK_SQL = 'DELETE FROM Books WHERE id = ?;'
const DEL_MOVIE_SQL = 'DELETE FROM Movies WHERE id = ?;'
const DEL_SHOW_SQL = 'DELETE FROM Shows WHERE id = ?;'

/*
const GET_LAST_FIC_SQL = 'SELECT * FROM Fics WHERE id = (SELECT MAX(id) FROM Fics);'
const GET_LAST_BOOK_SQL = 'SELECT * FROM Books WHERE id = (SELECT MAX(id) FROM Books);'
const GET_LAST_MOVIE_SQL = 'SELECT * FROM Movies WHERE id = (SELECT MAX(id) FROM Movies);'
const GET_LAST_SHOW_SQL = 'SELECT * FROM Shows WHERE id = (SELECT MAX(id) FROM Shows);'
*/

const ADD_FIC_SQL = 'INSERT INTO Fics(title, author, fandoms, wordcount, comments, link) VALUES (?, ?, ?, ?, ?, ?) RETURNING id;'
const ADD_BOOK_SQL = 'INSERT INTO Books(title, author, genre, comments) VALUES (?, ?, ?, ?) RETURNING id;'
const ADD_MOVIE_SQL = 'INSERT INTO Movies(title, genre, comments) VALUES (?, ?, ?) RETURNING id;'
const ADD_SHOW_SQL = 'INSERT INTO Shows(title, genre, comments) VALUES (?, ?, ?) RETURNING id;'

const EDIT_FIC_SQL = 'UPDATE Fics SET title=?, author=?, fandoms=?, wordcount=?, comments=?, link=? WHERE id=?;'
const EDIT_BOOK_SQL = 'UPDATE Books SET title=?, author=?, genre=?, comments=? WHERE id=?;'
const EDIT_MOVIE_SQL = 'UPDATE Movies SET title=?, genre=?, comments=? WHERE id=?;'
const EDIT_SHOW_SQL = 'UPDATE Shows SET title=?, genre=?, comments=? WHERE id=?;'

const db = await open({
    filename: "./media.db",
    driver: sqlite3.Database
});

await db.exec("CREATE TABLE IF NOT EXISTS Fics(id INTEGER PRIMARY KEY UNIQUE, title TEXT NOT NULL, author TEXT, fandoms TEXT, wordcount INTEGER, comments TEXT, link TEXT);")
await db.exec("CREATE TABLE IF NOT EXISTS Books(id INTEGER PRIMARY KEY UNIQUE, title TEXT NOT NULL, author TEXT, genre TEXT, comments TEXT);")
await db.exec("CREATE TABLE IF NOT EXISTS Movies(id INTEGER PRIMARY KEY UNIQUE, title TEXT NOT NULL, genre TEXT, comments TEXT);")
await db.exec("CREATE TABLE IF NOT EXISTS Shows(id INTEGER PRIMARY KEY UNIQUE, title TEXT NOT NULL, genre TEXT, comments TEXT);")

applyRateLimiting(app);
applyLooseCORSPolicy(app);
applyBodyParsing(app);
applyLogging(app);

// TODO!!!!!!! add more return codes, eg. 400?

// LOAD ENTRIES
app.get('/api/media', async (req, res) => {
    const table = req.query.type;
    try {
        switch(table) {
        case "Fics":
            var ret = await db.all(GET_FICS_TABLE_SQL);
            res.status(200).send(ret);
            break;
        case "Books":
            var ret = await db.all(GET_BOOKS_TABLE_SQL);
            res.status(200).send(ret);
            break;
        case "Movies":
            var ret = await db.all(GET_MOVIES_TABLE_SQL);
            res.status(200).send(ret);
            break;
        case "Shows":
            var ret = await db.all(GET_SHOWS_TABLE_SQL);
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
});


// DELETE ENTRY
app.delete('/api/media', async (req, res) => {
    const table = req.query.type;
    const entryID = req.query.id;
    try {
        switch(table) {
        case "Fics":
            var d = await db.get(GET_FIC_SQL, entryID)
            if (d) {
                await db.run(DEL_FIC_SQL, entryID);
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
            var d = await db.get(GET_BOOK_SQL, entryID)
            if (d) {
                await db.run(DEL_BOOK_SQL, entryID);
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
            var d = await db.get(GET_MOVIE_SQL, entryID)
            if (d) {
                await db.run(DEL_MOVIE_SQL, entryID);
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
            var d = await db.get(GET_SHOW_SQL, entryID)
            if (d) {
                await db.run(DEL_SHOW_SQL, entryID);
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

/*
// GET ENTRY W/ HIGHEST ID #
app.get('/api/media/latest', async (req, res) => {
    const table = req.query.type;
    try {
        switch(table) {
        case "Fics":
            var ret = await db.get(GET_LAST_FIC_SQL);
            if(ret) res.status(200).send(ret);
            else res.status(404).send({msg: "The table is empty!"});
            break;
        case "Books":
            var ret = await db.get(GET_LAST_BOOK_SQL);
            if(ret) res.status(200).send(ret);
            else res.status(404).send({msg: "The table is empty!"});
            break;
        case "Movies":
            var ret = await db.get(GET_LAST_MOVIE_SQL);
            if(ret) res.status(200).send(ret);
            else res.status(404).send({msg: "The table is empty!"});
            break;
        case "Shows":
            var ret = await db.get(GET_LAST_SHOW_SQL);
            if(ret) res.status(200).send(ret);
            else res.status(404).send({msg: "The table is empty!"});
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
*/

// ADD ENTRY
app.post('/api/media', async (req, res) => {
    const table = req.query.type;
    const site = req.query.site;
    const workid = req.query.workid;
    const entry = req.body.entry;

    try {
        switch(table) {
        case "Fics":
            if(site && workid) { // web-scraping
                let url = "https://";
                if(site === "archiveofourown") 
                    url += "archiveofourown.org/works/";
                else if (site === "fanfiction") 
                    url += "www.fanfiction.net/s/";
                url += workid;

                /*await axios(url).then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                })*/
            }
            else {
                const retFic = await db.get(ADD_FIC_SQL, entry.title, entry.author, entry.fandoms, entry.wordcount, entry.comments, entry.link);
                res.status(200).send({
                    msg: "Successfully posted!",
                    id: retFic.id
                });
            }
            break;
        case "Books":
            const retBook = await db.get(ADD_BOOK_SQL, entry.title, entry.author, entry.genre, entry.comments);
            res.status(200).send({
                msg: "Successfully posted!",
                id: retBook.id
            });
            break;
        case "Movies":
            const retMovie = await db.get(ADD_MOVIE_SQL, entry.title, entry.genre, entry.comments);
            res.status(200).send({
                msg: "Successfully posted!",
                id: retMovie.id
            });
            break;
        case "Shows":
            const retShow = await db.get(ADD_SHOW_SQL, entry.title, entry.genre, entry.comments);
            res.status(200).send({
                msg: "Successfully posted!",
                id: retShow.id
            });
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
});

// EDIT ENTRY
app.put('/api/media', async (req, res) => {
    const table = req.query.type;
    const entry = req.body.entry;

    try {
        switch(table) {
        case "Fics":
            var d = await db.get(GET_FIC_SQL, entry.id)
            if (d) {
                await db.run(EDIT_FIC_SQL, entry.title, entry.author, entry.fandoms, entry.wordcount, entry.comments, entry.link, entry.id);
                res.status(200).send({
                    "msg": "Successfully edited entry!"
                })
            } else {
                res.status(404).send({
                    "msg": "That entry was not found!"
                })
            }
            break;
        case "Books":
            var d = await db.get(GET_BOOK_SQL, entry.id)
            if (d) {
                await db.run(EDIT_BOOK_SQL, entry.title, entry.author, entry.genre, entry.comments, entry.id);
                res.status(200).send({
                    "msg": "Successfully edited entry!"
                })
            } else {
                res.status(404).send({
                    "msg": "That entry was not found!"
                })
            }
            break;
        case "Movies":
            var d = await db.get(GET_MOVIE_SQL, entry.id)
            if (d) {
                await db.run(EDIT_MOVIE_SQL, entry.title, entry.genre, entry.comments, entry.id);
                res.status(200).send({
                    "msg": "Successfully edited entry!"
                })
            } else {
                res.status(404).send({
                    "msg": "That entry was not found!"
                })
            }
            break;
        case "Shows":
            var d = await db.get(GET_SHOW_SQL, entry.id)
            if (d) {
                await db.run(EDIT_SHOW_SQL, entry.title, entry.genre, entry.comments, entry.id);
                res.status(200).send({
                    "msg": "Successfully edited entry!"
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


applyErrorCatching(app);

// Open server for business!
app.listen(port, () => {
    console.log(`My API has been opened on :${port}`)
});

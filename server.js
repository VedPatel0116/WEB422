/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ved Patel 
*  Student ID: __________ 
*  Date: ________________
*  Vercel Link: _______________________________________________________________
*
********************************************************************************/

const express = require('express');
const app = express();
const cors = require('cors');
const MoviesDB = require('./modules/moviesDB.js');
const db = new MoviesDB();
require('dotenv').config({ path: './.env' });
const connectionString = process.env.MONGODB_CONN_STRING;

const PORT = process.env.PORT || 4000;

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));



app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

app.use(cors()); 
app.use(express.json());

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(PORT, () => {
            console.log('Server is running on http://localhost:${PORT}');
        });
    })
    .catch((err) => {
        console.error('Failed to initialize the database:', err);
});

app.post('/api/movies', async (req, res) => {
    try {
        const newMovie = await db.addNewMovie(req.body); 
        res.status(201).json(newMovie); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to add the movie' });
    }
});

app.get('/api/movies', async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const perPage = parseInt(req.query.perPage) || 10; 
    const title = req.query.title || null;
  
    try {
      const movies = await db.getAllMovies(page, perPage, title);
      res.status(200).json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error.message);
      res.status(500).json({ error: 'Failed to fetch movies', details: error.message });
    }
  });
  
  

app.get('/api/movies/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const movie = await db.getMovieById(id);
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the movie' });
    }
});

app.put('/api/movies/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await db.updateMovieById(req.body, id); 
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Movie updated successfully' });
        } else {
            res.status(404).json({ error: 'Movie not found or no changes made' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the movie' });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const result = await db.deleteMovieById(id); 
        if (result.deletedCount > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the movie' });
    }
});


module.exports = app;
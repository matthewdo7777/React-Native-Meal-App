const express = require('express');
const app = express();
const cors = require("cors");

// Add basic middleware
app.use(cors());
app.use(express.json());

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'database',
    user: 'meal_user',
    password: '1234',
    database: 'meals'
});


// Handle database connection
connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

app.get('/', (req, res) => {
    res.status(200).send("This is running!");
});

app.get('/api/recipes', (req, res) => {
    connection.query('SELECT * FROM recipes', (error, results) => {
        if (error) {
            console.error('Database query error:', error.stack);
            return res.status(500).json({ error: 'Failed to fetch recipes' });
        }
        console.log("Successfully fetched all recipes");
        res.json(results);
    });
});

app.get('/api/food', (req, res) => {
    const { ingredients } = req.query;

    if (!ingredients?.trim()) {
        return res.status(400).json({ error: "Ingredients parameter is required" });
    }

    const _ingredients = ingredients.toLowerCase().split(',').map(ing => `%${ing.trim()}%`);
    const conditions = _ingredients.map(() => 'ingredients LIKE ?').join(' OR ');
    const sqlQuery = `SELECT id, image, name, description, ingredients, steps, nutrients, times, diet, allergies 
                     FROM recipes WHERE ${conditions}`;

    connection.query(sqlQuery, _ingredients, (error, results) => {
        if (error) {
            console.error('Database query error:', error.stack);
            return res.status(500).json({ error: 'Failed to fetch recipes by ingredients' });
        }
        console.log("Successfully fetched recipes by ingredients");
        res.json(results.length ? results : { ids: [] });
    });
});

app.get('/api/allergies', (req, res) => {
    const { ids, allergies } = req.query;

    if (!ids) {
        return res.status(400).json({ error: "Recipe IDs parameter is required" });
    }
    if (!allergies?.trim()) {
        return res.status(400).json({ error: "Allergies parameter is required" });
    }

    const _ids = ids.split(',').map(id => id.trim());
    const _allergies = allergies.toLowerCase().split(',').map(allergy => allergy.trim());
    const sqlQuery = `SELECT id, image, name, description, ingredients, steps, nutrients, times, diet, allergies 
                     FROM recipes WHERE id IN (${_ids.map(() => '?').join(', ')})`;

    connection.query(sqlQuery, _ids, (error, results) => {
        if (error) {
            console.error('Database query error:', error.stack);
            return res.status(500).json({ error: 'Failed to fetch recipes by allergies' });
        }

        const filteredRecipes = results.filter(recipe => {
            const recipeAllergies = JSON.parse(recipe.allergies).map(allergy => allergy.toLowerCase());
            return !_allergies.some(allergy => recipeAllergies.includes(allergy));
        });

        console.log("Successfully filtered recipes by allergies");
        res.json(filteredRecipes.length ? filteredRecipes : { ids: [] });
    });
});

app.get('/api/diets', (req, res) => {
    const { ids, diets } = req.query;

    if (!ids) {
        return res.status(400).json({ error: "Recipe IDs parameter is required" });
    }
    if (!diets?.trim()) {
        return res.status(400).json({ error: "Diets parameter is required" });
    }

    const _ids = ids.split(',').map(id => id.trim());
    const _diets = diets.toLowerCase().split(',').map(diet => diet.trim());
    const sqlQuery = `SELECT id, image, name, description, ingredients, steps, nutrients, times, diet, allergies 
                     FROM recipes WHERE id IN (${_ids.map(() => '?').join(', ')})`;

    connection.query(sqlQuery, _ids, (error, results) => {
        if (error) {
            console.error('Database query error:', error.stack);
            return res.status(500).json({ error: 'Failed to fetch recipes by diets' });
        }

        const filteredRecipes = results.filter(recipe => {
            const recipeDiets = JSON.parse(recipe.diet).map(diet => diet.toLowerCase());
            return _diets.every(diet => recipeDiets.includes(diet));
        });

        console.log("Successfully filtered recipes by diets");
        res.json(filteredRecipes.length ? filteredRecipes : { ids: [] });
    });
});

app.get('/api/results', (req, res) => {
    const { ids } = req.query;

    if (!ids) {
        return res.status(400).json({ error: "Recipe IDs parameter is required" });
    }

    const _ids = ids.split(',').map(id => id.trim());
    const sqlQuery = `SELECT id, image, name, description, ingredients, steps, nutrients, times, diet, allergies 
                     FROM recipes WHERE id IN (${_ids.map(() => '?').join(', ')})`;

    connection.query(sqlQuery, _ids, (error, results) => {
        if (error) {
            console.error('Database query error:', error.stack);
            return res.status(500).json({ error: 'Failed to fetch recipes by IDs' });
        }
        console.log("Successfully fetched recipes by IDs");
        res.json(results);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

// Handle database errors
connection.on('error', function(err) {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    }
});
const express = require('express');
const { resolve } = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {})
    .then(() => { console.log("Mongodb connected successfully") })
    .catch((err) => { console.log("Mongodb connection failed") });

const app = express();
const port = 3000;

app.use(express.static('static'));
const Menu = require("./menuSchema");
app.use(express.json());

app.post('/menu', async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({ msg: "Details of the product must be given" });
        }

        const newItem = new Menu({ name, description, price });
        await newItem.save();

        return res.status(201).json({ msg: "New Item added to Menu" });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err })
    }
});

app.get('/menu', async (req, res) => {
    try {
        const menuItems = await Menu.find();
        return res.json(menuItems);
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err })
    }
});

app.put('/menu/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;

        const updatedItem = await Menu.findByIdAndUpdate(id, { name, description, price }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ msg: "Menu item not found" });
        }

        return res.json(updatedItem);
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err })
    }
});

app.delete('/menu/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await Menu.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ msg: "Menu item not found" });
        }

        return res.json({ msg: "Menu item deleted successfully" });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err })
    }
});

app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
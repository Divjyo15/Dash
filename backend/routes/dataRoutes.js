
const express = require('express');
const fs = require('fs');
const Data = require('../models/data');

const router = express.Router();


router.post('/import', async (req, res) => {
    try {
        
        const data = JSON.parse(fs.readFileSync('jsondata.json', 'utf-8'));
  const result = await Data.insertMany(data);
        res.status(200).send(`${result.length} documents were inserted successfully.`);
    } catch (error) {
        console.error("Error importing data:", error);
        res.status(500).send("Failed to import data.");
    }
});
router.get('/', async (req, res) => {
    try {
        
        const filters = {};

        
        if (req.query.year && req.query.year !== 'all') {
            filters.start_year = req.query.year; 
        }
        if (req.query.topic && req.query.topic !== 'all') {
            filters.topic = req.query.topic;
        }
        if (req.query.region && req.query.region !== 'all') {
            filters.region = req.query.region;
        }
        if (req.query.pestle && req.query.pestle !== 'all') {
            filters.pestle = req.query.pestle;
        }
        if (req.query.source && req.query.source !== 'all') {
            filters.source = req.query.source;
        }
        if (req.query.swot && req.query.swot !== 'all') {
            filters.swot = req.query.swot;  
        }
        if (req.query.country && req.query.country !== 'all') {
            filters.country = req.query.country;
        }
        if (req.query.city && req.query.city !== 'all') {
            filters.city = req.query.city;
        }

        
        const data = await Data.find(filters);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Failed to fetch data.");
    }
});


module.exports = router;

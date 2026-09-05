const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");


const app = express();


const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const quotesFile = path.join(__dirname,".." "quotes.json");


// Read quotes
function getQuotes() {
    try {
        const data = fs.readFileSync(quotesFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading quotes:", error);
        return [];
    }
}


// Save quotes
function saveQuotes(quotes) {
    fs.writeFileSync(
        quotesFile,
        JSON.stringify(quotes, null, 2)
    );
}


// Home API
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to QuoteSphere API"
    });
});


// Get all quotes
app.get("/api/quotes", (req, res) => {
    const quotes = getQuotes();


    const { category, search } = req.query;


    let result = quotes;


    if (category && category !== "All") {
        result = result.filter(
            quote =>
                quote.category.toLowerCase() ===
                category.toLowerCase()
        );
    }


    if (search) {
        const searchText = search.toLowerCase();


        result = result.filter(
            quote =>
                quote.text.toLowerCase().includes(searchText)
                quote.author.toLowerCase().includes(searchText
        );
    }


    res.json(result);
});


// Get random quote
app.get("/api/quotes/random", (req, res) => {
    const quotes = getQuotes();


    if (quotes.length === 0) {
        return res.status(404).json({
            message: "No quotes available"
        });
    }


    const randomIndex =
        Math.floor(Math.random() * quotes.length);


    res.json(quotes[randomIndex]);
});


// Get quote by ID
app.get("/api/quotes/:id", (req, res) => {
    const quotes = getQuotes();


    const quote = quotes.find(
        q => q.id === Number(req.params.id)
    );


    if (!quote) {
        return res.status(404).json({
            message: "Quote not found"
        });
    }


    res.json(quote);
});


// Add quote
app.post("/api/quotes", (req, res) => {
    const quotes = getQuotes();


    const { text, author, category } = req.body;


    if (!text || !author || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }


    const newQuote = {
        id: Date.now(),
        text,
        author,
        category
    };


    quotes.push(newQuote);


    saveQuotes(quotes);


    res.status(201).json({
        message: "Quote added successfully",
        quote: newQuote
    });
});


// Delete quote
app.delete("/api/quotes/:id", (req, res) => {
    const quotes = getQuotes();


    const id = Number(req.params.id);


    const updatedQuotes =
        quotes.filter(q => q.id !== id);


    if (quotes.length === updatedQuotes.length) {
        return res.status(404).json({
            message: "Quote not found"
        });
    }


    saveQuotes(updatedQuotes);


    res.json({
        message: "Quote deleted successfully"
    });
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`QuoteSphere server running on port ${PORT
    });
}


module.exports = app;
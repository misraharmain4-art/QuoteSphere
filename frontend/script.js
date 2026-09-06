const API_URL = "https://quotesphere-backend.vercel.app";

let currentQuote = null;


// Elements

const quoteText =
    document.getElementById("quoteText");

const quoteAuthor =
    document.getElementById("quoteAuthor");

const quoteCategory =
    document.getElementById("quoteCategory");

const newQuoteBtn =
    document.getElementById("newQuoteBtn");

const copyBtn =
    document.getElementById("copyBtn");

const favoriteBtn =
    document.getElementById("favoriteBtn");

const shareBtn =
    document.getElementById("shareBtn");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const quotesContainer =
    document.getElementById("quotesContainer");

const themeBtn =
    document.getElementById("themeBtn");

const quoteForm =
    document.getElementById("quoteForm");


// Get random quote

async function getRandomQuote() {

    try {

        const response =
            await fetch(`${API_URL}/api/quotes/random`);

        const quote =
            await response.json();

        currentQuote = quote;

        displayQuote(quote);

    } catch (error) {

        console.error(error);

        quoteText.textContent =
            "Unable to load quote.";

    }
}


// Display quote

function displayQuote(quote) {

    quoteText.textContent =
        `"${quote.text}"`;

    quoteAuthor.textContent =
        `— ${quote.author}`;

    quoteCategory.textContent =
        quote.category;
}


// Load all quotes

async function loadQuotes() {

    try {

        const response =
            await fetch('${API_URL}/api/quotes');

        const quotes =
            await response.json();

        displayQuotes(quotes);

    } catch (error) {

        console.error(error);

    }
}


// Display quotes

function displayQuotes(quotes) {

    quotesContainer.innerHTML = "";

    if (quotes.length === 0) {

        quotesContainer.innerHTML =
            "<p>No quotes found.</p>";

        return;
    }

    quotes.forEach(quote => {

        const div =
            document.createElement("div");

        div.className = "quote-item";

        div.innerHTML = `
            <p>"${quote.text}"</p>

            <h4>— ${quote.author}</h4>

            <small>${quote.category}</small>

            <br><br>

            <button
                onclick="deleteQuote(${quote.id})">
                Delete
            </button>
        `;

        quotesContainer.appendChild(div);

    });
}


// Search quotes

async function searchQuotes() {

    const search =
        searchInput.value;

    const category =
        categoryFilter.value;

    const url =
        `${API_URL}/api/quotes?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;

    try {

        const response =
            await fetch(url);

        const quotes =
            await response.json();

        displayQuotes(quotes);

    } catch (error) {

        console.error(error);

    }
}


// Copy quote

copyBtn.addEventListener("click", async () => {

    if (!currentQuote) return;

    const text =
        `"${currentQuote.text}" — ${currentQuote.author}`;

    await navigator.clipboard.writeText(text);

    copyBtn.textContent = "✅ Copied!";

    setTimeout(() => {

        copyBtn.textContent = "📋 Copy";

    }, 1500);

});


// Favorite quote

favoriteBtn.addEventListener("click", () => {

    if (!currentQuote) return;

    let favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    const alreadyFavorite =
        favorites.some(
            q => q.id === currentQuote.id
        );

    if (!alreadyFavorite) {

        favorites.push(currentQuote);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        favoriteBtn.textContent =
            "❤️ Saved";

    } else {

        favoriteBtn.textContent =
            "❤️ Already Saved";

    }

});


// Share quote

shareBtn.addEventListener("click", async () => {

    if (!currentQuote) return;

    const text =
        `"${currentQuote.text}" — ${currentQuote.author}`;

    if (navigator.share) {

        await navigator.share({
            title: "QuoteSphere",
            text: text
        });

    } else {

        await navigator.clipboard.writeText(text);

        alert("Quote copied to clipboard!");

    }

});


// Add quote

quoteForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const text =
        document.getElementById("newQuoteText").value;

    const author =
        document.getElementById("newAuthor").value;

    const category =
        document.getElementById("newCategory").value;


    try {

        const response =
            await fetch('$/{API_URL}/api/quotes', {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text,
                    author,
                    category
                })

            });


        const data =
            await response.json();

        if (response.ok) {

            alert("Quote added successfully!");

            quoteForm.reset();

            loadQuotes();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

    }

});


// Delete quote

async function deleteQuote(id) {

    const confirmDelete =
        confirm("Delete this quote?");

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(`${API_URL}/api/quotes${id}`, {
                method: "DELETE"
            });

        if (response.ok) {

            loadQuotes();

        }

    } catch (error) {

        console.error(error);

    }

}


// Dark mode

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (
        document.body.classList.contains("dark")
    ) {

        themeBtn.textContent = "☀️";

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        themeBtn.textContent = "🌙";

        localStorage.setItem(
            "theme",
            "light"
        );

    }

});


// Search events

searchInput.addEventListener(
    "input",
    searchQuotes
);

categoryFilter.addEventListener(
    "change",
    searchQuotes
);


// New quote

newQuoteBtn.addEventListener(
    "click",
    getRandomQuote
);


// Load saved theme

if (
    localStorage.getItem("theme") === "dark"
) {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
}


// Initial loading

getRandomQuote();

loadQuotes();
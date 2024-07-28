// Array of quote objects
const quotes = [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: "Inspirational",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    category: "Motivational",
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life.",
    category: "Life",
  },
  {
    text: "If life were predictable it would cease to be life, and be without flavor.",
    category: "Life",
  },
  {
    text: "If you look at what you have in life, you'll always have more.",
    category: "Gratitude",
  },
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");
  formContainer.innerHTML = `
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteButton">Add Quote</button>
        </div>
    `;

  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Create and display the add quote form when the page loads
createAddQuoteForm();

// Display the first quote when the page loads
showRandomQuote();

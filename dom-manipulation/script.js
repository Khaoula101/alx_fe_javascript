// Array of quote objects, initially loaded from local storage if available
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
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

// Mock API URL
const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Replace with your mock API endpoint

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote)); // Save last viewed quote to session storage
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");

  // Create input elements
  const newQuoteText = document.createElement("input");
  newQuoteText.id = "newQuoteText";
  newQuoteText.type = "text";
  newQuoteText.placeholder = "Enter a new quote";

  const newQuoteCategory = document.createElement("input");
  newQuoteCategory.id = "newQuoteCategory";
  newQuoteCategory.type = "text";
  newQuoteCategory.placeholder = "Enter quote category";

  // Create button element
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  // Append elements to the form container
  formContainer.appendChild(newQuoteText);
  formContainer.appendChild(newQuoteCategory);
  formContainer.appendChild(addButton);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    saveQuotes(); // Save quotes to local storage
    populateCategories(); // Update the category filter
    alert("New quote added!");
    postQuoteToServer(newQuote); // Send the new quote to the server
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });

    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }

    notifyUser("Quote synced with server.");
  } catch (error) {
    console.error("Error posting quote to server:", error);
    notifyUser("Error syncing quote with server.");
  }
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map((quote) => quote.category))];

  // Clear existing options
  categoryFilter.innerHTML = "";

  // Add new options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore the last selected filter
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  showRandomQuote();
}

// Function to get filtered quotes based on the selected category
function getFilteredQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
    return quotes;
  } else {
    return quotes.filter((quote) => quote.category === selectedCategory);
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    handleServerQuotes(serverQuotes);
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Function to handle server quotes and resolve conflicts
function handleServerQuotes(serverQuotes) {
  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let mergedQuotes = [...serverQuotes, ...localQuotes];

  // Remove duplicate quotes based on text
  mergedQuotes = mergedQuotes.filter(
    (quote, index, self) =>
      index === self.findIndex((q) => q.text === quote.text)
  );

  quotes = mergedQuotes;
  saveQuotes();
  populateCategories();
  notifyUser("Quotes synced with server.");
}

// Function to sync quotes with the server
async function syncQuotes() {
  try {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Post all local quotes to the server
    for (const quote of localQuotes) {
      await postQuoteToServer(quote);
    }

    // Fetch the latest quotes from the server
    await fetchQuotesFromServer();
  } catch (error) {
    console.error("Error syncing quotes:", error);
    notifyUser("Error syncing quotes.");
  }
}

// Function to notify the user
function notifyUser(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 3000);
}

// Function to periodically sync with the server
function startPeriodicSync() {
  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 300000); // Sync every 5 minutes
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for the "Export Quotes" button
document
  .getElementById("exportQuotes")
  .addEventListener("click", exportToJsonFile);

// Create and display the add quote form when the page loads
createAddQuoteForm();

// Populate the category filter when the page loads
populateCategories();

// Display the last viewed quote if available, otherwise display a random quote
const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
if (lastViewedQuote) {
  document.getElementById(
    "quoteDisplay"
  ).innerHTML = `<p>${lastViewedQuote.text}</p><p><em>${lastViewedQuote.category}</em></p>`;
} else {
  showRandomQuote();
}

// Start periodic syncing with the server
startPeriodicSync();

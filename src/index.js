document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
  
    // Fetch quotes and render them on the page
    function fetchQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => renderQuotes(quotes));
    }
  
    // Render quotes on the page
    function renderQuotes(quotes) {
      quoteList.innerHTML = '';
      quotes.forEach(quote => {
        const quoteItem = createQuoteItem(quote);
        quoteList.appendChild(quoteItem);
      });
    }
  
    // Create a single quote item
    function createQuoteItem(quote) {
      const quoteItem = document.createElement('li');
      quoteItem.classList.add('quote-card');
      quoteItem.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      `;
  
      const deleteButton = quoteItem.querySelector('.btn-danger');
      deleteButton.addEventListener('click', () => deleteQuote(quote.id));
  
      const likeButton = quoteItem.querySelector('.btn-success');
      likeButton.addEventListener('click', () => addLike(quote.id));
  
      return quoteItem;
    }
  
    // Create a new quote
    function createQuote(quoteText, author) {
      const quote = {
        quote: quoteText,
        author: author
      };
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quote)
      })
      .then(response => response.json())
      .then(newQuote => {
        const quoteItem = createQuoteItem(newQuote);
        quoteList.appendChild(quoteItem);
        newQuoteForm.reset();
      });
    }
  
    // Delete a quote
    function deleteQuote(quoteId) {
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
      })
      .then(() => {
        const quoteItem = document.querySelector(`.quote-card[data-id="${quoteId}"]`);
        quoteItem.remove();
      });
    }
  
    // Add a like to a quote
    function addLike(quoteId) {
      const likeData = {
        quoteId: quoteId
      };
  
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(likeData)
      })
      .then(response => response.json())
      .then(newLike => {
        const quoteItem = document.querySelector(`.quote-card[data-id="${quoteId}"]`);
        const likeButton = quoteItem.querySelector('.btn-success');
        const likeCount = likeButton.querySelector('span');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
      });
    }
  
    // Event listener for new quote form submission
    newQuoteForm.addEventListener('submit', event => {
      event.preventDefault();
      const quoteText = document.getElementById('quote').value;
      const author = document.getElementById('author').value;
      createQuote(quoteText, author);
    });
  
    // Fetch quotes when the DOM content is loaded
    fetchQuotes();
});
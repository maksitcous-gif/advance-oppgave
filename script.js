
let books = [];
let currentFilters = {
    genre: 'all'
};
let currentSort = {
    by: 'title'
};


const bookForm = document.getElementById('book-form');
const booksContainer = document.getElementById('books-container');
const filterGenre = document.getElementById('filter-genre');
const sortBy = document.getElementById('sort-by');


document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    loadBooks();
    renderBooks();

    bookForm.addEventListener('submit', addBook);
    filterGenre.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applySorting);
}


function loadBooks() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }
}


function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}


function addBook(e) {
    e.preventDefault();
    
  
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const pages = parseInt(document.getElementById('pages').value) || 0;
    const reading = document.getElementById('reading').checked;
    
  
    const newBook = {
        id: Date.now().toString(),
        title,
        author,
        genre,
        pages,
        reading,
        dateAdded: new Date().toISOString()
    };
    
   
    books.push(newBook);
    
  
    saveBooks();
    renderBooks();
    
    
    bookForm.reset();
}


function renderBooks() {
   
    let filteredBooks = filterBooks(books);
    filteredBooks = sortBooks(filteredBooks);
    
 
    booksContainer.innerHTML = '';
    
    if (filteredBooks.length === 0) {
        booksContainer.innerHTML = '<p>No books found. Add some books to your library!</p>';
        return;
    }
    
   
    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        
        if (book.reading) bookCard.classList.add('reading');
        
        
        const { id, title, author, genre, pages, reading } = book;
        
        bookCard.innerHTML = `
            <div class="book-header">
                <div>
                    <div class="book-title">${title}</div>
                    <div class="book-author">by ${author}</div>
                </div>
            </div>
            <div class="book-details">
                <p><strong>Genre:</strong> ${genre}</p>
                ${pages ? `<p><strong>Pages:</strong> ${pages}</p>` : ''}
            </div>
            <div class="status-badges">
                ${reading ? '<span class="badge reading">Currently Reading</span>' : ''}
                <span class="badge genre">${genre}</span>
            </div>
            <div class="book-actions">
                <button class="toggle-reading-btn" data-id="${id}">
                    ${reading ? 'Mark as Read' : 'Mark as Reading'}
                </button>
                <button class="delete-btn" data-id="${id}">Delete</button>
            </div>
        `;
        
        booksContainer.appendChild(bookCard);
    });
    
   
    document.querySelectorAll('.toggle-reading-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleReadingStatus(e.target.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteBook(e.target.dataset.id));
    });
}


function toggleReadingStatus(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex !== -1) {
        books[bookIndex].reading = !books[bookIndex].reading;
        saveBooks();
        renderBooks();
    }
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        books = books.filter(book => book.id !== bookId);
        saveBooks();
        renderBooks();
    }
}


function filterBooks(booksToFilter) {
    return booksToFilter.filter(book => {
     
        if (currentFilters.genre !== 'all' && book.genre !== currentFilters.genre) {
            return false;
        }
        
        return true;
    });
}

function sortBooks(booksToSort) {
    return [...booksToSort].sort((a, b) => {
        let aValue, bValue;
        
     
        switch (currentSort.by) {
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
            case 'author':
                aValue = a.author.toLowerCase();
                bValue = b.author.toLowerCase();
                break;
            case 'pages':
                aValue = a.pages || 0;
                bValue = b.pages || 0;
                break;
            case 'genre':
                aValue = a.genre.toLowerCase();
                bValue = b.genre.toLowerCase();
                break;
            default:
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
        }
        
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
}


function applyFilters() {
    currentFilters.genre = document.getElementById('filter-genre').value;
    renderBooks();
}


function applySorting() {
    currentSort.by = document.getElementById('sort-by').value;
    renderBooks();
}
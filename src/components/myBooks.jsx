import  { useState, useEffect } from 'react';
import axios from 'axios';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const userId = localStorage.getItem('id');
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`https://deploynodejs-2.onrender.com/book/get-my-books/${userId}`);
        setBooks(response.data.books);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user books:', error);
      }
    };

    fetchBooks();
  }, [userId]);

  const openPDF = (pdfUrl) => {
    setSelectedBook(pdfUrl);
  };

  const closePDF = () => {
    setSelectedBook(null);
  };

  return (
    <div style={styles.bookListContainer}>
      <h1 style={styles.bookListTitle}>My Books</h1>
      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>You haven't bought any books yet.</p>
      ) : (
        <div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Author</th>
                <th>Read</th> {/* New column for the "Read" button */}
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id}>
                  <td>{book.bookName}</td>
                  <td>{book.bookDescription}</td>
                  <td>{book.bookPrice} TND</td>
                  <td>{book.Author}</td>
                  <td>
                    <button
                      onClick={() => openPDF(`https://deploynodejs-2.onrender.com/uploads/${book.filename}`)}
                      style={styles.readButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                      Read
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedBook && (
            <div>
              <button onClick={closePDF} style={styles.closeButton}>Close PDF</button>
              <iframe src={selectedBook} style={styles.iframe}></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
    readButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background-color 0.3s',
      },
    
      readButtonHover: {
        backgroundColor: '#0056b3',
      },
  bookListContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  bookListTitle: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '12px 15px',
    textAlign: 'left',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '10px 15px',
    textAlign: 'left',
  },
  iframe: {
    width: '100%',
    height: '600px',
    marginTop: '20px',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none',
    marginRight: '10px',
  },
};

export default MyBooks;

import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf';
import Book from './Book';

class BooksApp extends React.Component {
  state = {
   books: [],
   query: '',
   showingBooks: []
 }

  updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.findIndex(b => b.id === book.id) > 0) {
      books = this.state.books.map(b => {
        if (b.id === book.id) {
          return {...book, shelf}
        } else {
          return b
        }
      })
    } else {
      books = [...this.state.books, {...book, shelf}]
      }

    this.setState({books})

    BooksAPI.update(book, shelf).then((data) => {
    })
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({books})
    })
  }

  updateQuery = (query) => {
    this.setState({query})
    let showingBooks = []
    if (query) {
      BooksAPI.search(query).then(response => {
        if (response.length) {
          showingBooks = response.map( b => {
            const index =this.state.books.findIndex(c => c.id === b.id)
            if( index >= 0 ) {
              return this.state.books[index] 
            } else {
              return b
              }
          })
        }     
        this.setState({showingBooks})
      })
    } else {
      this.setState({showingBooks})
      }
  }

  render() {
    const {query } = this.state
    return (
      <div className="app">

        <Route exact path='/' 
               render={()=>(
          <BookShelf books={this.state.books}
                     onUpdateShelf={(book, shelf) =>
                       this.updateShelf(book,shelf)
                     }/>
               )}
        />

        <Route path='/search' render={(History)=>(
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to='/'>Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" 
                       placeholder="Search by title or author"
                       value={query}
                       onChange={(event) => this.updateQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.showingBooks.map((book) => (
                  <Book key={book.id} 
                        book={book}
                        onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)}/>
                ))}
              </ol>
            </div>
          </div>
        )}
        />
      </div>
    )
  }
}
export default BooksApp

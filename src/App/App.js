import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import { getNotesForFolder, findNote, findFolder } from '../notes-helpers';
import './App.css';
import StateContext from '../StateContext';

const BASE_URL = 'http://localhost:9090/';

class App extends Component {
  state = {
    notes: [],
    folders: [],
    error: null
  };

  static contextType = StateContext
  handleDeleteNote = (noteId) => {
    fetch(`${BASE_URL}notes/${noteId}`, {method:'DELETE'})
    .then(() => this.fetcher())
  }

  componentDidMount(){
    this.fetcher()
  }

  fetcher() {
    return ['notes', 'folders'].map(point => {
      fetch(BASE_URL + point, {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(res.status)
          }
          return res.json()
        })
        .then(data => {
          this.setState({
            [point]: data
          })
        })
        .catch(error => this.setState({ error }))
    })
  }
  // componentDidMount() {
  //   // fake date loading from API call
  //   setTimeout(() => this.setState(dummyStore), 600);
  // }

  renderNavRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListNav}
          />
        ))}
        <Route
          path="/note/:noteId"
          component={NotePageNav}
        />
        <Route path="/add-folder/:folderId" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
          />
        ))}
        <Route
          path="/note/:noteId"
          component={NotePageMain}
        />
      </>
    );
  }

  render() {
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      getNotesForFolder,
      findNote,
      findFolder,
      clickNoteDelete: this.handleDeleteNote
    }

    return (
        <StateContext.Provider value={contextValue}>
          <div className="App">
            <nav className="App__nav">{this.renderNavRoutes()}</nav>
            <header className="App__header">
              <h1>
                <Link to="/">Noteful</Link> <FontAwesomeIcon icon="check-double" />
              </h1>
            </header>
            <main className="App__main">{this.renderMainRoutes()}</main>
          </div>
        </StateContext.Provider>
    );
  }
}

export default App;

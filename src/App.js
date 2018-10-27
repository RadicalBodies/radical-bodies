import React, { Component } from 'react'
import './App.css'

import SimpleCard from './Card'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Radical Bodies
          </p>
	  <SimpleCard/>
        </header>
      </div>
    )
  }
}

export default App

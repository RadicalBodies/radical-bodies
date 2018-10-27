import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

import SimpleCard from './Card'

class App extends Component {
  async componentDidMount() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      try {
        // Request account access if needed
        await window.ethereum.enable()
        console.log('Web3 enabled!')
        console.log(window.web3)
        window.web3.eth.getAccounts().then(console.log)
        window.web3.eth.getBlockNumber().then(console.log)
        // Acccounts now exposed
        // window.web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
        console.error(error)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      console.log('Legacy web3 detected!')
      // Acccounts always exposed
      // window.web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    } 
  }

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

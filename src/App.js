import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

import SimpleCard from './Card'

import Market from './abi/Market.json'
import Property from './abi/Property.json'

const tempData = [
  {
    name: 'Lane Rettig',
    price: 1.25,
    description: 'I like to flirt and smoke weed.',
    owner: '',
  },
  {
    name: 'Deaner Eiger',
    price: 0.01,
    description: 'I am really really cheap.',
    owner: '0x43025Ebf69Bd7459AF00899C245a8434534AE3D7a',
  },
  {
    name: 'Amy Jung',
    price: 277.00,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    owner: '0x43025Ebf69Bd7459AF00899C245a8434534AE3D7a',
  },
  {
    name: 'axic',
    price: 22.22,
    description: ':)',
    owner: '0x67942789Cd7B7b9066F227FE23818B707B878e83',
  },
]

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
        //
        const market = new window.web3.eth.Contract(Market, '0x1128c76de1361cc4d79a5a94502d1c916ea66b0b')
        const property = new window.web3.eth.Contract(Property, '0x106c4b8fd36e498912eda24d7964334c0bd0cf5a')
        console.log('Market:', market)
        console.log('Property:', property)
        window.market = market // FIXME
        window.property = property // FIXME
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
          {tempData.map(prop => <SimpleCard property={prop}/>)}
        </header>
      </div>
    )
  }
}

export default App

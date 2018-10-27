import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

import config from './config'

import CardView from './CardView'

import Market from './abi/Market.json'
import Property from './abi/Property.json'

class App extends Component {
  state = {
    web3Connected: false,
    loading: true,
    properties: [],
    contractMarket: undefined,
    contractProperty: undefined,
  }

  async connectToWeb3() {
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
        this.setState({web3Connected: true})
      } catch (error) {
        // User denied account access...
        console.error(error)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      console.log('Legacy web3 detected!')
      this.setState({web3Connected: true})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    } 
  }

  async loadContracts() {
    const market = new window.web3.eth.Contract(Market, config.addressMarket)
    const property = new window.web3.eth.Contract(Property, config.addressProperty)
    this.setState({
      contractMarket: market,
      contractProperty: property,
    })
    // console.log('Market:', market)
    // console.log('Property:', property)
    // window.market = market // FIXME
    // window.property = property // FIXME
  }

  async fetchProperty(propId) {
    const res = await fetch(`${config.baseUrl}/listings/${propId}`)
    const property = await res.json()
    return property
  }

  async fetchProperties() {
    // Get the list of properties
    const numProperties = await this.state.contractProperty.methods.totalSupply().call()
    console.log(`Found ${numProperties} properties in web3 provider`)
    // Why is it so awkward to do range() in JS?
    const properties = [...Array(Number(numProperties)).keys()].map(i => this.state.contractProperty.methods.tokenURI(i).call())
    console.log(properties)
    const propertiesMetadata = await Promise.all(properties)
    console.log(propertiesMetadata)
    // const res = await this.fetchProperty(propertiesMetadata[0])
    const res = await Promise.all(propertiesMetadata.map(p => this.fetchProperty(p)))
    console.log(res)
    this.setState({properties: res})
  }

  async componentDidMount() {
    await this.connectToWeb3()
    if (!this.state.web3Connected)
      return console.error('Failed to connect to web3, not able to fetch data')
    await this.loadContracts()
    if (!this.state.contractProperty)
      return console.error('Failed to load property contract from web3 provider')
    await this.fetchProperties()
  }

  render() {
    return this.state.properties.length ? (
      <div className="App">
        <header className="App-header">
          <p>
            Radical Bodies
          </p>
          <CardView elements={this.state.properties}/>
        </header>
      </div>
    ) : <p>No data!</p>
  }
}

export default App

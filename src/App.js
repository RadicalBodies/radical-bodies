import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

import config from './config'

import BuyModal from './BuyModal'
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
    buyModalOpen: false,
    propertyToBuy: undefined,
    propertyMetadata: undefined,
  }

  async openBuyModal(property) {
    // Fetch some additional metadata from web3 first
    window.contract = this.state.contractMarket
    const taxRate = await this.state.contractMarket.methods.taxRatePerInterval().call()
    const epsilon = await this.state.contractMarket.methods.epsilon().call()
    const curPrice = await this.state.contractMarket.methods.priceOf(property.tokenId).call()
    this.setState({
      buyModalOpen: true,
      propertyToBuy: property,
      propertyMetadata: {taxRate, epsilon, curPrice},
    })
  }

  onBuyModalClose() {
    this.setState({buyModalOpen: false})
  }

  async onBuy(id) {
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

    // Build an array of property data
    const properties = []
    for (let i = 0; i < Number(numProperties); i++) {
      const propertyMetadataURI = await this.state.contractProperty.methods.tokenURI(i).call()
      console.log(`Read web3 data for property ${i}:`, propertyMetadataURI)
      // If the URI is empty that is a deleted property.
      if (propertyMetadataURI.length !== 0) {
        const property = await this.fetchProperty(propertyMetadataURI)
        console.log(`Fetched data for property ${propertyMetadataURI}:`, property)
        properties.push({tokenId: i, ...property})
      }
    }

    this.setState({properties})
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
          {
            this.state.propertyToBuy ?
              <BuyModal
                open={this.state.buyModalOpen}
                onBuy={this.onBuy}
                handleClose={this.onBuyModalClose.bind(this)}
                property={this.state.propertyToBuy}
                propertyMetadata={this.state.propertyMetadata}
              />
            :
              null
          }
          <p>
            Radical Bodies
          </p>
          <CardView elements={this.state.properties} onSelect={this.openBuyModal.bind(this)}/>
        </header>
      </div>
    ) : <p>No data!</p>
  }
}

export default App

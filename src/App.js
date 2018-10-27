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
    web3Account: undefined,
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

  async onBuy(data) {
    console.log("onBuy:", data)
    const {name, description, email, price, intervals, tokenId} = data

    // Save the metadata to the database
    const purchase = await this.savePurchase({name, description, email})
    console.log("Saved new purchase data:", purchase)

    // Convert the units
    const priceInWei = window.web3.utils.toWei((price*10).toString(), "ether")
    const priceInWei2 = window.web3.utils.toWei((price*100).toString(), "ether")

    // Kick off the web3 transaction
    const res = await this.state.contractMarket.methods.buy(
      tokenId,
      intervals,
      priceInWei,
      purchase._id
    ).send({
      from: this.state.web3Account,
      value: priceInWei2,
    })
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
        // window.web3.eth.getAccounts().then(console.log)
        // window.web3.eth.getBlockNumber().then(console.log)
        const accounts = await window.web3.eth.getAccounts()
        this.setState({web3Connected: true, web3Account: accounts[0]})
      } catch (error) {
        // User denied account access...
        console.error(error)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      console.log('Legacy web3 detected!')
      const accounts = await window.web3.eth.getAccounts()
      this.setState({web3Connected: true, web3Account: accounts[0]})
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

  async savePurchase(purchase) {
    const res = await fetch(`${config.baseUrl}/purchases/`, {
      method: 'post',
      body: JSON.stringify(purchase),
    })
    const purchaseData = await res.json()
    console.log("Created purchase:", purchaseData)
    return purchaseData
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
      const property = await this.fetchProperty(propertyMetadataURI)
      console.log(`Fetched data for property ${propertyMetadataURI}:`, property)
      properties.push({tokenId: i, ...property})
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
                onBuy={this.onBuy.bind(this)}
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
          <p>
            Account connected: {this.state.web3Account}
          </p>
        </header>
      </div>
    ) : <p>No data!</p>
  }
}

export default App

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

function getModalStyle() {
  return {
    top: '5%',
    left: '5%',
    right: '5%',
    bottom: '5%',
  }
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  root: {
    flexGrow: 1,
  },
})

class SimpleModal extends React.Component {
  state = {
    name: '',
    description: '',
    email: '',
    price: '',
    totalPrice: '',
    intervals: '',
    tokenId: undefined,
    periodStart: '',
    tax: '',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  async componentDidMount() {
    // Update the total price
    this.updateTotalPrice()
  }

  async updateTotalPrice() {
    const res = await this.props.contractMarket.methods.calculatePrice(
      this.props.property.tokenId,
      this.state.intervals,
      window.web3.utils.toWei(this.state.price, "ether"),
    ).call()
    console.log("Got result from calculatePrice:", res)
    const {periodStart, price, tax} = res
    const periodStartDate = new Date(periodStart * 1000)
    const periodStartString = `${periodStartDate.getHours()}:${periodStartDate.getMinutes()}`
    // console.log("periodStart:", periodStart)
    // console.log("date:", new Date(periodStart * 1000))
    // console.log("date:", (new Date(periodStart * 1000)).toString())
    this.setState({
      // periodStart: new (Date(periodStart * 1000)).toString(),
      periodStart: periodStartString,
      price: window.web3.utils.fromWei(price, "ether"),
      tax,
    })
  }

  static getDerivedStateFromProps(props, state) {
    // Only do this once! This is messy
    if (state.price)
      return null

    const {
      property,
      propertyMetadata,
    } = props
    console.log("Got property:", property)
    console.log("Metadata:", propertyMetadata)
    const newPrice = window.web3.utils.fromWei((Number(propertyMetadata.curPrice) + Number(propertyMetadata.epsilon)).toString(), "ether")
    return {
      price: newPrice,
      tokenId: property.tokenId,
    }
  }

  render() {
    const {
      classes,
      open,
      handleClose,
      property,
      propertyMetadata,
      onBuy,
    } = this.props

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              About {property.name ? property.name : "??"}
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              Current Price: {window.web3.utils.fromWei(propertyMetadata.curPrice, "ether")} ETH
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              {property.description ? property.description  : "This one is a mystery"}
            </Typography>
            <p/>
            <Typography variant="h6" id="modal-title">
              Purchase {property.name ? property.name : "??"}'s body
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
              <Grid container className={classes.root} spacing={16}>
                <Grid item xs={12}>
                  <Grid container className={classes.demo} justify="center" spacing={16}>
                    <Grid item>
                      <TextField
                        // id="standard-number"
                        label="Reserve price"
                        value={this.state.price}
                        onChange={this.handleChange('price')}
                        type="number"

                        // these three don't appear to be working =[
                        min={this.state.price}
                        max="100"
                        step="0.01"

                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        label="Email"
                        value={this.state.email}
                        onChange={this.handleChange('email')}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        label="Description"
                        value={this.state.description}
                        onChange={this.handleChange('description')}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        label="Start Time"
                        type="time"
                        value={this.state.periodStart}
                        className={classes.textField}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        label="End Time"
                        value={this.state.intervals}
                        onChange={this.handleChange('intervals')}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <p>TOTAL PRICE: {this.state.totalPrice}</p>
                </Grid>
                <Grid item xs={12}>
                  <Button size="large" onClick={() => onBuy(this.state)}>PURCHASE</Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Modal>
      </div>
    )
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
  propertyMetadata: PropTypes.object.isRequired,
  onBuy: PropTypes.func.isRequired,
  contractMarket: PropTypes.object.isRequired,
}

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal)

export default SimpleModalWrapped

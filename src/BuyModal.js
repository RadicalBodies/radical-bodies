import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

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
})

class SimpleModal extends React.Component {
  state = {
    name: '',
    description: '',
    email: '',
    price: '',
    intervals: '',
    tokenId: undefined,
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  static getDerivedStateFromProps(props, state) {
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
              Price: {window.web3.utils.fromWei(propertyMetadata.curPrice, "ether")}
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              {property.description ? property.description  : "This one is a mystery"}
            </Typography>
            <Typography variant="h6" id="modal-title">
              Purchase {property.name ? property.name : "??"}'s body
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
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
              <TextField
                required
                // id="standard-required"
                label="Email"
		value={this.state.email}
		onChange={this.handleChange('email')}
                className={classes.textField}
                margin="normal"
              />
              <TextField
                required
                // id="standard-required"
                label="Description"
		value={this.state.description}
		onChange={this.handleChange('description')}
                className={classes.textField}
                margin="normal"
              />
              <TextField
                required
                // id="standard-read-only-input"
                label="Start Time"
                className={classes.textField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                required
                // id="standard-required"
                label="End Time"
		value={this.state.intervals}
		onChange={this.handleChange('intervals')}
                className={classes.textField}
                margin="normal"
              />
              <Button size="large" onClick={() => onBuy(this.state)}>PURCHASE</Button>
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
}

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal)

export default SimpleModalWrapped

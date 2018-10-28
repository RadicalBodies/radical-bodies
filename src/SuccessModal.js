import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
// import Button from '@material-ui/core/Button'
// import TextField from '@material-ui/core/TextField'

function getModalStyle() {
  return {
    top: '35%',
    left: '15%',
    right: '15%',
    bottom: '35%',
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

  render() {
    const {
      classes,
      open,
      handleClose,
      property,
      // propertyMetadata,
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
              You successfully bought {property.name ? property.name : "??"}
            </Typography>
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
  // propertyMetadata: PropTypes.object.isRequired,
  // onBuy: PropTypes.func.isRequired,
}

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal)

export default SimpleModalWrapped

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import SimpleCard from './Card'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
})

class GuttersGrid extends React.Component {
  state = {
    spacing: '16',
  }

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value,
    })
  }

  render() {
    const { classes, elements, onSelect } = this.props
    const { spacing } = this.state
    console.log('CardView got props:', elements)

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={Number(spacing)}>
            {
              elements.map(prop =>
                <Grid key={prop._id} item>
                  <SimpleCard property={prop} onSelect={onSelect}/>
                </Grid>
              )
            }
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

GuttersGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  elements: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default withStyles(styles)(GuttersGrid)

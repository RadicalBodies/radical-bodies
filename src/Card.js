import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = {
  card: {
    minWidth: 275,
    maxWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}

function SimpleCard(props) {
  const { classes, property } = props

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          { property.name }
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          { property.price } ETH
        </Typography>
        <Typography component="p">
          { property.description.length > 100 ? `${property.description.substring(0,100)}...` : property.description }
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">BUY</Button>
      </CardActions>
    </Card>
  )
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleCard)


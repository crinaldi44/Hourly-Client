import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import ThumbUpAltTwoTone from '@mui/icons-material/ThumbUpAltTwoTone'

/**
 * Represents a pane that contains actions for the user.
 * @returns {JSX.Element}
 */
const UserValidationTools = (props) => {

  const {
    disabled=true,
    onConfirm,
  } = props;

  const handleClick = () => {
    if (onConfirm) onConfirm();
  }

  return (
    <Card variant='outlined'>
        <CardContent>
            <Typography variant='body2' color='textSecondary'><strong>Actions</strong></Typography>
        </CardContent>
        <CardActions>
            <LoadingButton onClick={handleClick} disabled={disabled} color='success' startIcon={<ThumbUpAltTwoTone/>} variant='contained' size='small'>Confirm</LoadingButton>
        </CardActions>
    </Card>
  )
}

export default UserValidationTools
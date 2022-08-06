import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Business from '@mui/icons-material/Business'
import Edit from '@mui/icons-material/Edit'
import Skeleton from '@mui/material/Skeleton'
import LoadingButton from '@mui/lab/LoadingButton'


/**
 * Represents a user profile screen for displaying
 * information regarding a user.
 * @returns {JSX.Element}
 */
const UserProfile = (props) => {

  const {

    /**
     * Represents the user associated with the profile.
     */
    user

  } = props;


  return (<><Card square style={{ overflow: 'visible' }}>
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'} style={{ marginTop: '-50px', textAlign: 'center' }}>
        <Avatar sx={{ marginLeft: 'auto', marginRight: 'auto', height: '100px', width: '100px' }} />
        <Typography variant="h5" style={{ color: 'var(--primary-dark)' }}><strong>{!user ? <Skeleton width={200} /> : (user.first_name + ' ' + user.last_name)}</strong></Typography>
        <Typography variant="body2" color="textSecondary">{!user || (user && !user.title) ? <Skeleton /> : user.title}</Typography>
        <Typography color='primary' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{user && user.company && <Business style={{ marginRight: '5px' }} fontSize='inherit' />} {!user || (user && !user.company) ? <Skeleton width={150} /> : user.company.name}</Typography>
      </Grid>
    </Grid>
    <CardContent>
    </CardContent>
    <Divider />
    <CardActions>
      <LoadingButton loading={!user} startIcon={<Edit />} variant="outlined" color="primary">
        Edit User
      </LoadingButton>
    </CardActions>
  </Card>
  </>
  )
}

export default UserProfile
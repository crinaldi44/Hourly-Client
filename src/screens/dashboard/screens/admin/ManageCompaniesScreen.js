import React from 'react'
import View from '../../components/View'
import Container from "@mui/material/Container"
import Header from '../../components/Header'
import Button from '@mui/material/Button'
import AddCircle from '@mui/icons-material/AddCircle'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

/**
 * The ManageCompaniesScreen is an interactive menu reserved only for developers
 * and administrators. This screen allows users with elevated privilege to manage
 * setup for new companies within the application.
 * @author chrisrinaldi
 * @date 18 July, 2022
 * @returns {JSX.Element}
 */
const ManageCompaniesScreen = () => {
  return ( <View>
    <Container maxWidth='xl'>
        <Header action={<Button style={{height: '50px'}} startIcon={<AddCircle/>} variant="contained">New Company</Button>}>Developer Menu</Header>
        <br/>
    </Container>
  </View>
  )
}


export default ManageCompaniesScreen
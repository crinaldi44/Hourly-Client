import React from 'react'
import View from '../../../components/View'
import Container from '@mui/material/Container'
import Header from '../../../components/Header'

/**
 * Represents a screen that allows an organization admin to manage
 * and manipulate events accordingly. From here, the org owner can
 * add, update and delete events as well as assign employee(s) to events.
 * @author chrisrinaldi
 * @date 14 August, 2022
 * @returns {JSX.Element}
 */
const ManageEventsScreen = () => {
  return ( <View>
    <Container maxWidth='xl'>
    <Header breadcrumbs={[{
            title: 'Schedule',
            to: '/dashboard/events'
        }]}>Schedule</Header>
    </Container>
  </View>
  )
}

export default ManageEventsScreen
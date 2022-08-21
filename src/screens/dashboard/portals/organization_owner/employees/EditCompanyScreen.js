import React from 'react'
import Container from '@mui/material/Container'
import View from '../../../components/View'
import Header from '../../../components/Header'

/**
 * Allows the org owner to edit their company.
 * @author chrisrinaldi
 * @date 21 August, 2022
 * @returns {JSX.Element}
 */
const EditCompanyScreen = () => {
  return (
    <View>
        <Container maxWidth='xl'>
            <Header breadcrumbs={[
                {
                    title: 'My Company',
                    to: '/dashboard/company'
                }
            ]}>My Company</Header>
        </Container>
    </View>
  )
}


export default EditCompanyScreen
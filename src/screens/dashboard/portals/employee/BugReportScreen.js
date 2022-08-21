import React from 'react'
import Container from '@mui/material/Container'
import View from '../../components/View'
import Header from '../../components/Header'
import ReportBugForm from '../../components/ReportBugForm'

/**
 * Represents a screen on which a user may choose to report a bug. Integrates
 * with emailJS to reduce latency on the API's email service and properly sanitize
 * and reroute spam.
 * @returns {JSX.Element}
 * @author chrisrinaldi
 * @date 21 August, 2022
 */
const BugReportScreen = () => {
  return (
    <View>
        <Container maxWidth='xl' style={{textAlign: 'left'}}>
            <Header alert={{
                title: 'Beta Notice',
                message: 'Thank you for reporting a bug! By doing so, you are helping us improve your experience.',
            }} breadcrumbs={[
            {
                title: 'Report a Bug',
                to: '/dashboard/report-bug'
            }
        ]}>Report a Bug</Header>
        <br/>
        <ReportBugForm/>
        </Container>
    </View>
  )
}


export default BugReportScreen
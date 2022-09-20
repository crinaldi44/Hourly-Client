import React from 'react'
import EmployeeApiController from '../../../../api/impl/EmployeeApiController'
import Grid from '@mui/material/Grid'
import View from '../../components/View'
import Container from '@mui/material/Container'
import Header from '../../components/Header'
import UserValidationTable from '../../components/validation/UserValidationTable'
import FilePicker from '../../components/FilePicker'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import UserValidationFilter from '../../components/validation/UserValidationFilter'
import { v4 as uuidv4 } from 'uuid'
import { parseValidationsFromSpreadsheet, readValidationsFromCsv } from '../../../../api/util/validation'
import UserValidationErrorPanel from '../../components/validation/UserValidationErrorPanel'
import UserValidationTools from '../../components/validation/UserValidationTools'

/**
 * Represents a screen on which admins can bulk import or transfer user timesheet tracking data. Admins
 * will be able to bulk import employee and timesheet data. They may not change roles.
 * @returns {JSX.Element}
 */
const ImportUserScreen = () => {

  const [pidToValidation, setPidToValidation] = React.useState({})

  const [filteredPidToValidation, setFilteredPidToValidation] = React.useState({})

  const [loading, setLoading] = React.useState(false);

  const EmployeesApi = new EmployeeApiController();

  const handleReset = () => {
    setLoading(false);
    setPidToValidation({})
    setFilteredPidToValidation({})
  }

  const handleFilesChanged = (newFiles) => {
    if (newFiles.length === 0) {
      handleReset();
      return;
    }
    setLoading(true)
    readValidationsFromCsv(newFiles[0]).then(async (result) => {
      const validations = parseValidationsFromSpreadsheet(result)
      const newValidations = await EmployeesApi.validateEmployees(validations);
      if (newValidations) {
        let newValidationPidToValidation = {}
        newValidations.map(validation => {
          newValidationPidToValidation[uuidv4()] = validation;
        })
        setPidToValidation(newValidationPidToValidation);
        setFilteredPidToValidation(newValidationPidToValidation);
        setLoading(false);
      }
    });
  }

  const validateEmployee = async (pid, newValidation) => {
    const response = await EmployeesApi.validateEmployees([newValidation])
    if (response) {
      let newValidationPidToValidation = {...pidToValidation}
      newValidationPidToValidation[pid] = response[0]
      setPidToValidation(newValidationPidToValidation);
      setFilteredPidToValidation(newValidationPidToValidation)
    }
  }

  const handleUpload = async () => {
        
  }

  return (
    <View>
      <Container maxWidth='xl' style={{textAlign: 'left'}}>
        <Header alert={{
          title: "Importing Users",
          message: "You can import users in accordance with the user import guide. Please note that companies and departments must exist prior to import."
        }} breadcrumbs={[
                  {
                      title: 'Users',
                      to: '/dashboard/developer/users',
                  },
                  {
                      title: 'Signup',
                      to: '/dashboard/developer/users/signup',
                  }
              ]}>Import Users</Header>
        <br/>
        <Grid container spacing={2}>
          <Grid item md={8} sm={12}>
            <Card variant='outlined'>
              <CardContent>
                <UserValidationFilter loading={loading}/>
                <br/>
                <UserValidationTable 
                  onValidationChanged={validateEmployee}
                  loading={loading} 
                  pidToValidation={filteredPidToValidation}/>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4} sm={12}>
            <FilePicker multiple={false} 
              fileType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
              uploadText="Upload CSV"
              onFilesChanged={handleFilesChanged}/>
            <br/>
            <UserValidationErrorPanel pidToValidation={filteredPidToValidation} loading={loading}/>
          </Grid>
        </Grid>
      </Container>
    </View>
  )
}

export default ImportUserScreen
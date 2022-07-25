import { AddCircle } from '@mui/icons-material';
import {
    Typography,
    Box,
    Button,
    Container
} from '@mui/material';
import React, {useState} from 'react';
import Header from '../../../components/Header';
import TabView from '../../../components/TabView';
import View from '../../../components/View';
import AddDepartmentForm from './AddDepartmentForm';
import Departments from './Departments';
import Timesheets from './Timesheets';

/**
 * Represents the departments screen.
 * @returns {JSX.Element}
 */
const DepartmentsScreen = () => {

  const [addDeptOpen, setAddDeptOpen] = useState(false);

  /**
   * Handles opening the add department modal.
   */
  const handleAddDeptOpen = () => {
    setAddDeptOpen(true)
  }

  const handleAddDeptClose = () => {
    setAddDeptOpen(false)
  }

  return <View>
    <Container maxWidth={'xl'}>
    <Header
        action={<Button style={{height: '50px'}} variant='contained' startIcon={<AddCircle/>} onClick={handleAddDeptOpen}>Add Department</Button>}
    >Manage Departments</Header>
    <br/>
    <TabView sx={{width: '95%', ml: 'auto', mr: 'auto'}}>
        <Box label='Departments'>
            <Departments/>
        </Box>
        <Box label="Timesheets">
          <Timesheets/>
        </Box>
    </TabView>
    <AddDepartmentForm open={addDeptOpen} handleClose={handleAddDeptClose} />
    </Container>
  </View>;

};

/**
 * Represents the departments screen.
 * @returns {JSX.Element}
 */
export default DepartmentsScreen;

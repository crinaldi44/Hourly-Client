import React from "react";
import Header from "../../components/Header";
import PersonAdd from '@mui/icons-material/PersonAdd'
import View from '../../components/View'
import Container from '@mui/material/Container'
import UserSignupForm from "../../components/UserSignupForm";
import EmployeeApiController from '../../../../api/impl/EmployeeApiController'
import Person from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import CompanyApiController from "../../../../api/impl/CompanyApiController";
import {useSnackbar} from "notistack";
import RoleApiController from "../../../../api/impl/RoleApiController";

/**
 * Represents the screen at which users are signed up by an administrative user,
 * such as a developer or IT professional.
 * @returns {JSX.Element}
 * @author chrisrinaldi
 * @date 25 July, 2022
 */
const AddUserScreen = () => {

    /**
     * Represents the Employee API Controller instance.
     * @type {EmployeeApiController}
     */
    const EmployeeApi = new EmployeeApiController()

    /**
     * Represents the Company API controller instance.
     * @type {CompanyApiController}
     */
    const CompaniesApi = new CompanyApiController();

    /**
     * Represents the Roles API controller instance.
     * @type {RoleApiController}
     */
    const RolesApi = new RoleApiController();

    /**
     * Represents the snackbar hook.
     */
    const { enqueueSnackbar } = useSnackbar();

    /**
     * Represents the listing of companies available to the user.
     */
    const [companies, setCompanies] = React.useState([])

    /**
     * Represents the roles available.
     */
    const [roles, setRoles] = React.useState([])

    /**
     * Handles the action to be taken when the user model input
     * has changed from the signup form.
     * @param user
     */
    const handleSubmit = (user) => {

    }

    /**
     * Fetches data that is necessary for the form.
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
        try {
            const response = await CompaniesApi.findAll()
            const rolesResponse = await RolesApi.findAll()
            if (response && response.length > 0 && rolesResponse && rolesResponse.length > 0) {
                setCompanies(response)
                setRoles(rolesResponse)
            }
        } catch(error) {
            enqueueSnackbar(error && error.response ? error.response.detail : 'The server encountered an unexpected error whilst processing your request.', {
                variant: 'error'
            })
        }
    }

    React.useEffect(() => {
        fetchData();
    }, [])

    return (<View>
        <Container maxWidth={'xl'}>
            <Header breadcrumbs={[
                {
                    title: 'Users',
                    to: '/dashboard/developer/users',
                    icon: <Person sx={{mr: 0.5}} fontSize={'inherit'}/>
                },
                {
                    title: 'Signup',
                    to: '/dashboard/developer/users/signup',
                    icon: <PersonAdd sx={{mr: 0.5}} fontSize={'inherit'}/>
                }
            ]}>Add User</Header>
            <br/>
            <UserSignupForm companies={companies} roles={roles} />
        </Container>
    </View>)

}

export default AddUserScreen;
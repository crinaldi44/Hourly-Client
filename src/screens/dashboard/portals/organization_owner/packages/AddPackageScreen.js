import React from 'react'
import View from '../../../components/View'
import Container from '@mui/material/Container'
import Header from '../../../components/Header'
import PackageForm from '../../../components/PackageForm'
import PackageApiController from '../../../../../api/impl/PackageApiController'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'

/**
 * Represents a screen that allows an organization owner to add a new
 * package.
 * @returns {JSX.Element}
 */
const AddPackageScreen = () => {

    const PackagesApi = new PackageApiController();

    const {enqueueSnackbar} = useSnackbar();

    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);

    const handlePackageSubmission = async (pkg) => {
        setLoading(true);
        try {
            await PackagesApi.add(pkg)   
            enqueueSnackbar("Package successfully added!", {
                variant: 'success'
            })
            navigate('/dashboard/packages')
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.detail : 'The server encountered an error whilst processing your request.', {
                variant: 'error'
            })
            setLoading(false);
        }
    }

  return ( <View>
    <Container maxWidth='xl'>
    <Header breadcrumbs={[
                {
                    title: 'Packages',
                    to: '/dashboard/packages',
                },
                {
                    title: 'Add Package',
                    to: '/dashboard/orgadmin/packages/add'
                }
            ]}>New Package</Header>
    <br/>
    <PackageForm
        loading={loading}
        onSubmit={handlePackageSubmission}
    />
    </Container>
  </View>
  )
}


export default AddPackageScreen
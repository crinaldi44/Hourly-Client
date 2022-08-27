import React from 'react'
import View from '../../../components/View'
import Container from '@mui/material/Container'
import Header from '../../../components/Header'
import PackageForm from '../../../components/PackageForm'
import PackageApiController from '../../../../../api/impl/PackageApiController'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * Represents a screen that allows an organization owner to add a new
 * package.
 * @returns {JSX.Element}
 */
const EditPackageScreen = () => {

    const PackagesApi = new PackageApiController();

    const {enqueueSnackbar} = useSnackbar();

    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    
    const [packageEdit, setPackageEdit] = React.useState();

    const {packageId} = useParams();

    const handlePackageSubmission = async (pkg) => {
        setLoading(true);
        try {
            await PackagesApi.update(packageId, pkg, packageEdit)
            enqueueSnackbar('Package has been successfully updated.', {
                variant: 'success'
            })
            navigate('/dashboard/packages')
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.detail : 'An error occurred whilst processing your request.', {
                variant: 'error'
            })
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            let packages = await PackagesApi.findById(packageId)
            if (packages) {
                setPackageEdit(packages)
            }
            setLoading(false)
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.detail : 'An error occurred whilst fetching the package!', {
                variant: 'error'
            })
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
                    title: 'Edit Package',
                    to: '/dashboard/orgadmin/packages/edit'
                }
            ]}>Edit Package</Header>
    <br/>
    {packageEdit && <PackageForm
        loading={loading}
        onSubmit={handlePackageSubmission}
        initialPackage={packageEdit}
    />}
    </Container>
  </View>
  )
}


export default EditPackageScreen
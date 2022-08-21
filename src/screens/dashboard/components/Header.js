import React from 'react';
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link'
import {Link as RouterLink, useLocation} from 'react-router-dom'
import Collapse from '@mui/material/Collapse'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

/**
 * A Header is a reusable component that displays a
 * formatted section of typography denoting which page
 * the user is currently on.
 * @property {JSX.Element} action represents an action button that can be passed down
 * @returns {JSX.Element}
 */
const Header = (props) => {

    const {
        children,
        action,
        breadcrumbs,
        alert
    } = props

    const location = useLocation()

    /**
     * Represents the state of the provided alert being open.
     */
    const [alertOpen, setAlertOpen] = React.useState(true)

    /**
     * Renders the breadcrumbs of the header uniformly. To display breadcrumbs,
     * the 'breadcrumbs' prop can be utilized, e.g.:
     *
     * [
     *  {
     *      title: 'Dashboard',
     *      to: '/dashboard',
     *      icon: <HomeIcon/>,
     *  }
     * ]
     * @param index
     */
    const renderBreadcrumbs = () => {
        if (breadcrumbs.length === 0) return;
        return breadcrumbs.map(breadcrumb => (
            <Link key={breadcrumb.title} fontSize={'small'} component={RouterLink} color={location.pathname === breadcrumb.to ? 'primary' : 'inherit'} to={breadcrumb.to} underline={'hover'} sx={{ display: 'flex', alignItems: 'center' }}>{breadcrumb.icon || ''}{breadcrumb.title}</Link>
        ))
    }

  return <>
    <Grid container justifyContent={'space-between'} alignItems={'center'} rowSpacing={1}>
      <Grid item>
        <Typography variant='h4' fontWeight={700} color='var(--primary-dark)' textAlign='left'>{children}</Typography>
          {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs maxItems={4} separator={'›'} sx={{mt: '5px'}}>
              <Link key='dashboard' fontSize={'small'} component={RouterLink} to={'/dashboard'} underline={'hover'} sx={{display: 'flex', alignItems: 'center'}} color={'inherit'}>Dashboard</Link>
              {renderBreadcrumbs()}
          </Breadcrumbs>}
      </Grid>
      <Grid item>
        {action}
      </Grid>
    </Grid>
    {alert && <><br/>
        <Collapse in={alertOpen}>
        <Alert onClose={!alert.persist ? () => { setAlertOpen(false) } : null} severity={alert.severity ? alert.severity : 'info'} variant='filled'>
          <AlertTitle><strong>{alert.title}</strong></AlertTitle>
          {alert.message}
        </Alert>
        </Collapse></>}
  </>;
};

/**
 * A Header is a reusable component that displays a
 * formatted section of typography denoting which page
 * the user is currently on.
 * @returns {JSX.Element}
 */
export default Header;

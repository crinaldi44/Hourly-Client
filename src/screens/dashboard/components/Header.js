import React from 'react';
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link'
import {Link as RouterLink, useLocation} from 'react-router-dom'

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
        breadcrumbs
    } = props

    const location = useLocation()

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
            <Link fontSize={'small'} component={RouterLink} color={location.pathname === breadcrumb.to ? 'primary' : 'inherit'} to={breadcrumb.to} underline={'hover'} sx={{ display: 'flex', alignItems: 'center' }}>{breadcrumb.icon || ''}{breadcrumb.title}</Link>
        ))
    }

  return <>
    <Grid container justifyContent={'space-between'} alignItems={'center'} rowSpacing={1}>
      <Grid item>
        <Typography variant='h4' fontWeight={700} color='var(--primary-dark)' textAlign='left'>{children}</Typography>
          {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs maxItems={4} separator={'›'} sx={{mt: '5px'}}>
              <Link fontSize={'small'} component={RouterLink} to={'/dashboard'} underline={'hover'} sx={{display: 'flex', alignItems: 'center'}} color={'inherit'}>Dashboard</Link>
              {renderBreadcrumbs()}
          </Breadcrumbs>}
      </Grid>
      <Grid item>
        {action}
      </Grid>
    </Grid>
  </>;
};

/**
 * A Header is a reusable component that displays a
 * formatted section of typography denoting which page
 * the user is currently on.
 * @returns {JSX.Element}
 */
export default Header;

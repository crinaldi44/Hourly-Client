import React from 'react';
import {
    Box,
    Button,
    Typography
} from '@mui/material'
import Grid from '@mui/material/Grid';

/**
 * A Header is a reusable component that displays a
 * formatted section of typography denoting which page
 * the user is currently on.
 * @property {JSX.Element} action represents an action button that can be passed down
 * @returns {JSX.Element}
 */
const Header = (props) => {
  return <>
    <Grid container justifyContent={'space-between'} alignItems={'center'} rowSpacing={1}>
      <Grid item>
        <Typography variant='h4' fontWeight={700} color='var(--primary-dark)' textAlign='left'>{props.children}</Typography>
      </Grid>
      <Grid item>
        {props.action}
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

import { withTheme } from '@emotion/react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { grey } from '@mui/material/colors'
import React from 'react'

/**
 * A View is a full width container for a particular view. Views
 * contain a styling for light mode and dark mode that can be
 * overridden in the default theme.
 * @author chrisrinaldi
 * @since 20 March, 2022
 * @returns {JSX.Element}
 */
const View = styled(withTheme(Box))((props) => ({
    width: '100%',
    minHeight: 'calc(100vh - 64px)',
    paddingBottom: '30px',
    // background: props.theme.palette.mode === 'light' ? grey[100] : props.theme.palette.background.paper,
}))

export default View
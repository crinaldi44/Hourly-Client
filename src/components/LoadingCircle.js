import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import React from 'react'

/**
 * The LoadingCircle is a component that signifies that data
 * is still being retrieved from the server.
 **/ 
const LoadingCircle = () => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
        <CircularProgress/>
        <Typography fontSize='12px'>Loading...</Typography>
    </Box>
  )
}

/**
 * The LoadingCircle is a component that signifies that data
 * is still being retrieved from the server.
 **/ 
export default LoadingCircle
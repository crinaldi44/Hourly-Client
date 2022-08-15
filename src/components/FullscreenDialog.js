import React from 'react';
import Dialog from '@mui/material/Dialog'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Slide from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close';

/**
 * A FullscreenDialog is a component that presents a fullscreen interface
 * prompting the user either for some info or presents a form. Use as follows:
 * 
 * <FullscreenDialog>
 * ...elements
 * </FullscreenDialog>
 * 
 * The intention of this component is to direct the focus of attention, particularly
 * when modifying or changing otherwise sensitive data.
 * @property open represents the variable storing the 'open' state of the dialog
 * @property handleClose represents action taken when the dialog closes
 * @property title represents the title of the dialog
 * @returns {JSX.Element}
 */
const FullscreenDialog = (props) => {


    return <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'var(--primary-dark)' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
                <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {props.title}
            </Typography>
            <Button autoFocus color="inherit" onClick={props.handleConfirm} variant="contained" sx={{backgroundColor: 'var(--primary-color)', 
                ':hover': { backgroundColor: 'var(--primary-color)', filter: 'brightness(110%)'}}}>
              Confirm
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{height: '100%',backgroundColor: 'var(--offwhite)'}}>
          {props.children}
        </div>
      </Dialog>
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * A FullscreenDialog is a component that presents a fullscreen interface
 * prompting the user either for some info or presents a form.
 * 
 * The intention of this component is to direct the focus of attention, particularly
 * when modifying or changing otherwise sensitive data.
 * @returns {JSX.Element}
 */
export default FullscreenDialog;

import React from 'react'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import ClickAwayListener from '@mui/material/ClickAwayListener'

/**
 * Represents a cell that can be double clicked to allow the user to edit the cell. Takes
 * a callback which takes the new validation as parameters. Example uses of this are, for example,
 * if you want to re-validate one particular cell rather than the entire set at once.
 * @param {*} props 
 * @returns 
 */
const UserValidationEditCell = (props) => {

  /**
   * Represents whether the cell is in edit mode.
   */
  const [editing, setEditing] = React.useState(false);

  /**
   * Represents the new value held by the textfield.
   */
  const [newValue, setNewValue] = React.useState('')

  const {
    fieldName,
    onValidationChange,
    validation,
  } = props;

  /**
   * Handles action taken when the user double clicks on the cell.
   */
  const handleDoubleClick = () => {
    setEditing(true);
  }

  /**
   * Listens for the user to key in 'Enter' to re-validate.
   * @param {*} event 
   */
  const enterKeyListener = (event) => {
    if (event.key === 'Enter') handleClickAway();
  }

  /**
   * Handles action taken when the text field content changes.
   * @param {*} event 
   */
  const handleChange = (event) => {
    setNewValue(event.target.value)
  }

  /**
   * Handles action taken on clickaway.
   */
  const handleClickAway = () => {
    setEditing(false);
    if (onValidationChange && newValue !== '') {
      if (newValue === validation[fieldName]) return;
      let newValidation = {...validation}
      newValidation[fieldName] = newValue;
      onValidationChange(newValidation);
    }
  }

  return (
    <TableCell {...props} onDoubleClick={handleDoubleClick}>
      {editing ? <ClickAwayListener onClickAway={handleClickAway}><TextField onKeyPress={enterKeyListener} variant='filled' size='small' onChange={handleChange} defaultValue={validation[fieldName]}/></ClickAwayListener> : validation[fieldName]}
    </TableCell>
  )
}

export default UserValidationEditCell
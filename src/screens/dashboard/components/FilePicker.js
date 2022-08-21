import React from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Delete from '@mui/icons-material/Delete'
import Folder from '@mui/icons-material/Folder'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import UploadFile from '@mui/icons-material/UploadFile'

/**
 * Represents a button that accepts files for processing and upload.
 * @author chrisrinaldi
 * @date 21 August, 2022
 * @returns {JSX.Element}
 */
const FilePicker = (props) => {

    const {

        /**
         * Represents whether the file picker should be disabled.
         * @optional
         */
        disabled,

        /**
         * Represents the file type. By default, this is configured
         * to handle images.
         * @optional
         */
        fileType='image/*',

        /**
         * Represents the set of initial files.
         */
        initialFiles=[],

        /**
         * Represents whether the file handler should accept multiple
         * files. The default behavior is to accept multiple files.
         * @optional
         */
        multiple=true,

        /**
         * Represents action to be taken when the file changes.
         */
        onFilesChanged,

        /**
         * Represents the styling for the file picker.
         */
        style,

        /**
         * Represents the text stored in the upload message.
         */
        uploadText='Upload Files',

    } = props;

    const [files, setFiles] = React.useState(initialFiles)

    /**
     * Represents action taken when the input file has changed.
     * @param {*} file 
     */
    const handleFileChanged = (file) => {
        let newFiles = Object.values(file)
        setFiles(newFiles)
        if (onFilesChanged) {
            onFilesChanged(newFiles)
        }
    }

    /**
     * Handles action taken when a file is deleted from the queue.
     * @param {*} index 
     */
    const handleFileDeleted = (index) => {
        let newFiles = [...files]
        if (onFilesChanged) {
            onFilesChanged(newFiles)
        }
    }

    const handleReset = () => {
        setFiles([])
        if (onFilesChanged) {
            onFilesChanged([])
        }
    }

  return (<Card variant='outlined' style={{...style, opacity: disabled ? 0.5 : 1}}>
    <CardContent>
    <Typography style={{marginBottom: 15}} variant='body2' color='textSecondary'><strong>Files</strong> ({files.length})</Typography>
    {files.length > 0 ? (
        <>
            {files.map((file, index) => (
                <Alert key={index} severity='info' icon={<Folder/>} action={<IconButton disabled={disabled} size='small'><Delete fontSize='small'/></IconButton>} style={{marginBottom: 15}}><strong>{file.name}</strong> ({parseFloat(file.size / 1048576).toFixed(2)} MB)</Alert>
            ))}
        </>
    ) : (
        <>
            <Typography variant='body2' color='textSecondary'>No files uploaded. Please utilize the button below.</Typography>
            <br/>
        </>
    )}
    <Grid container justifyContent='space-between'>
        <Grid item>
            <Button component='label' disabled={disabled ? disabled : files.length > 0} startIcon={<UploadFile/>} variant='contained'>
                {uploadText}
                <input onInput={(e) => { handleFileChanged(e.target.files) }} hidden accept="image/*" multiple={multiple} type="file"/>
            </Button>
        </Grid>
        <Grid item>
            <Button disabled={disabled ? disabled : files.length === 0} onClick={() => { handleReset() }} variant='contained'>Reset</Button>
        </Grid>
    </Grid>
    </CardContent>
    </Card>
  )
}


export default FilePicker
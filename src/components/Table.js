import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import React from 'react'
import { Grid, LinearProgress, Typography } from '@mui/material'
import LoadingCircle from './LoadingCircle'
import { Festival } from '@mui/icons-material'

/**
 * A PaginationTable is a re-usable table that utilizes server-side
 * pagination to retrieve results in a UX-friendly amount of time. By
 * default, you will need to specify an array of column names to desginate
 * the columns.
 * 
 * You may also specify an onPageChange 
 * @returns {JSX.Element}
 */
const PaginationTable = (props) => {

    const {
        columns,
        data,
        count,
        onPageChange,
        onRowsPerPageChange,
        loading,
        renderCell,
        renderEmpty,
        rowsPerPage,
        rowsPerPageOptions,
        initialPage
    } = props;

    const [currentRowsPerPage, setCurrentRowsPerPage] = React.useState(rowsPerPage ? rowsPerPage : 10)

    const [page, setPage] = React.useState(initialPage ? initialPage : 0)

    const renderColumns = () => {

        if (!columns || columns.length === 0) {
            throw new Error('Expected prop columns, however received a value of null or undefined.')
        }

        return (columns.map(column => (
            <TableCell width={column.width}>{column.name}</TableCell>
        )))
    }

    /**
     * Renders each of the rows in a uniform formatting.
     * @returns {JSX.Element}
     */
    const renderRows = () => {
        return data && data.length > 0 && data.slice(0,rowsPerPage).map((item) => (
            <TableRow hover>
                    {renderDataForFields(item)}
            </TableRow>
        ))
    }

    /**
     * Renders data for the column that corresponds to the column field name
     * within the data object, if it exists.
     * @param {Object} entry 
     * @returns {JSX.Element}
     */
    const renderDataForFields = (entry) => {
        return columns && columns.length > 0 && columns.map(column => {
            if (column.renderCell) {
                return <TableCell width={column.width}>{column.renderCell(entry)}</TableCell>
            }
            if (entry[column.field]) {
                return (
                <TableCell width={column.width}>{entry[column.field]}</TableCell>
            )} else {
                return <TableCell width={column.width}></TableCell>
            }
        })
    }

    const handleRowsPerPageChange = (event) => {
        if (!rowsPerPage) setCurrentRowsPerPage(event.target.value)
        if (onRowsPerPageChange) onRowsPerPageChange(event.target.value)
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        if (onPageChange) onPageChange(newPage)
    }

  return ( 
    <Paper square>
        <Table>
            <TableHead>
                {renderColumns()}
                {loading && <TableRow>
                <TableCell style={{padding: '0px'}} colSpan={columns.length}>
                    <LinearProgress/>
                </TableCell>
            </TableRow>}
            </TableHead>
            <TableBody>
                {(!data || (data && data.length === 0)) && <TableRow style={{height: '350px'}}>
                    <TableCell colSpan={columns.length}>
                        {renderEmpty && renderEmpty()}
                    </TableCell>
                </TableRow>}
                {renderRows()}
            </TableBody>
            <TablePagination
                    count={count ? count : (data && data.length ? data.length : 0)} 
                    page={page}
                    rowsPerPage={rowsPerPage ? rowsPerPage : currentRowsPerPage}
                    rowsPerPageOptions={rowsPerPageOptions ? rowsPerPageOptions : [5, 10, 25]}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={handlePageChange}
                />
        </Table>
    </Paper>
  )
}


export default PaginationTable
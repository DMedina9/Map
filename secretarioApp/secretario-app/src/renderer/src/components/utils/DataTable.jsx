import {GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlotProps,
  Toolbar,
  ToolbarButton} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {SaveIcon, CancelIcon} from '@mui/icons-material'
const paginationModel = { page: 0, pageSize: 15 };

export default function DataTable(props) {
  const columns = props.columns || []
  columns.push(
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              material={{
                sx: {
                  color: 'primary.main',
                },
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    })
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15]}
        sx={{ border: 0 }}
        {...props}
      />
    </Paper>
  );
}
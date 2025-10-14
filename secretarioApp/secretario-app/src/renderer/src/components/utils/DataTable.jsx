import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
const paginationModel = { page: 0, pageSize: 15 };

export default function DataTable(props) {
  const columns = props.columns || []
  const { handleEditClick, handleDeleteClick } = props;
  if (!columns.find(item => item.field == 'actions'))
    columns.push(
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = false;//rowModesModel[id]?.mode === GridRowModes.Edit;

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
              //              onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                //              onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(id)}
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
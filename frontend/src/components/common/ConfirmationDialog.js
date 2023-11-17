import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogTitle, DialogContentText } from '@mui/material';

//* NOT IN USE YET; FUNCTIONALITY NOT TESTED
const ConfirmationDialog = ({open,target,remove,setMode}) => {


    return(
        <Dialog fullWidth maxWidth='sm' open={open} onClose={()=>setMode("default")} aria-label="confirm-delete-dialog">
        <DialogTitle>
			Deleting {target.title}</DialogTitle>
		<DialogContent >
			<DialogContentText> 
				This action cannot be undone.</DialogContentText>
		</DialogContent>
		<DialogActions >
		<Button autoFocus  variant="contained" color="secondary" onClick={() => setMode("default")}
			>Cancel</Button>
		<Button variant="contained" color="alert" onClick={remove}
			>Confirm Delete</Button>
		</DialogActions>
        </Dialog>
        )
    }

export default ConfirmationDialog;
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { DialogActions, DialogTitle, DialogContentText } from '@mui/material';

//* NOT IN USE YET; FUNCTIONALITY NOT TESTED
const ConfirmationDialog = ({open,cancel,confirm,children,text}) => {


    return(
        <Dialog fullWidth maxWidth='sm' open={open} onClose={cancel} aria-label="confirm-dialog">
        <DialogTitle>
			{children}</DialogTitle>
		<DialogContent >
			<DialogContentText> 
				{text||"This action cannot be undone."}</DialogContentText>
		</DialogContent>
		<DialogActions >
		<Button autoFocus  variant="contained" color="secondary" onClick={cancel}
			>Cancel</Button>
		<Button variant="contained" color="alert" onClick={confirm}
			>Confirm</Button>
		</DialogActions>
        </Dialog>
        )
    }

export default ConfirmationDialog;
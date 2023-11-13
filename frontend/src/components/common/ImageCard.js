import { useState } from 'react';
import { Card, CardMedia, CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const ImageCard = ({page}) => {


//VARIABLES FOR VIEWING IMAGES
const [open, setOpen] = useState(false);

const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //HANDLE DEFAULT IMAGE
  const default_img = 'https://res.cloudinary.com/kaaoskoodarit/image/upload/v1699876476/user_uploads/skrd5vixnpy7jcc0flrh.jpg'
  const image = (page.image !== 'error.jpg' && page.image !== "") ? page.image : default_img  


    return(
        
        <Card elevation={3} sx={{ p:1, maxWidth:300 }}>
            <CardActionArea onClick={handleClickOpen}>
            <CardMedia sx={{height:200}} image={image} title={"Image for "+page.title}/>
            </CardActionArea>
            <Dialog open={open} onClose={handleClose} aria-label="image-dialog">
        <DialogContent maxWidth="1000" maxHeight="1000" >
            <img height='100%' width='100%' src={image} alt={""}/>
        </DialogContent>
            </Dialog> </Card> 
    )
}
export default ImageCard;

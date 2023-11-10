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
  const default_img = 'https://media.discordapp.net/attachments/1161992163765256203/1169189304220782662/image.png?ex=65547f64&is=65420a64&hm=32e108ff3fe3bb4e9bb89feed07a87015edb99fcc6a8f1d1ecc6b2ae8d4f0017&='
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

import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {addWorld} from './../actions/worldActions';
import UploadWidget from './Cloudinary/UploadWidget';

//MUI IMPORTS
import { Button, Grid, Typography, Paper } from '@mui/material';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';





const CreateWorld = (props) => {
	// Set state for page
    //NIMEÄ UUDELLEEN STATE
	const [worldstate,setWorldstate] = useState({
		title:"",
        custom_url:"",         // custom_url = title
		image:"",
        description:"",
        private_notes:"",
		categories:[],            
		lore_pages:[]            
	})

    // Get token and categorystate from the store
    //const worldid = useSelector(state => state.world.page.id);
    //const worldurl = useSelector(state => state.world.page.custom_url);
    //const categorystate = useSelector(state => state.category.page);
    //const lorelist = useSelector(state => state.lore.list)

    // Use dispatch and navigate
    const dispatch = useDispatch();
    //const navigate = useNavigate();


    // Handle normal onChange events    
    const onChange = (event) => {

        //custom url can be max 50 characters!
        if (event.target.name === "custom_url"&&event.target.value.length === 50) {
            return
        }
        setWorldstate((worldstate) => {
            return {
                ...worldstate,
                [event.target.name]:event.target.value
            }
        })
    }

    
    // Handle onSubmit event
    const onSubmit = (event) => {
        event.preventDefault();
        // Add relationships to state

        //REPLACE SPACES WITH UNDERLINE, MAKE THE TITLE AS URL IF NONE SPECIFIED
        //custom url can be max 50 characters! (thus, the SLICE command)
        worldstate.custom_url = worldstate.custom_url === ""? worldstate.title.slice(0,49).replace(/\s+/g, '_') : worldstate.custom_url.replace(/\s+/g, '_')

        // Add the new page to the database
        dispatch(addWorld(worldstate));
        // Redirect to the new World?

        // Reset the state of the page and relationships
        setWorldstate({
            title:"",
            custom_url:"",         // custom_url = title
            image:"",
            description:"",
            private_notes:"",
            categories:[],            
            lore_pages:[]          
        })

    }
    
    return(
		<Paper elevation={3} sx={{ p:2}}>
            <form onSubmit={onSubmit}>
            
        <Typography variant='lore'>Create a new World</Typography>
		<Grid container spacing={2}>
		

		<Grid item xs={8}>
		<Container sx={{ p:0, display: 'flex', flexDirection: 'column' }}>
        <TextField id="world-title" name="title" label="Title" required multiline maxRows={2}
            value={worldstate.title} onChange={onChange}/>
            <br/>
		{/* <Typography variant="h6">Description:</Typography> */}
        <TextField id="world-description" name="description" label="Description" multiline maxRows={10}
            value={worldstate.description} onChange={onChange}/>
		{/* <Typography variant="h6">Private Notes:</Typography> */}
        <br/>
        <TextField id="world-private_notes" name="private_notes" label="Private Notes" multiline maxRows={4}
            value={worldstate.private_notes} onChange={onChange}/>
		<br/>
        <TextField id="world-custom_url" name="custom_url" required label="Display URL as:"
            value={worldstate.custom_url} onChange={onChange}/>
		</Container>
		</Grid>
		<Grid item xs={4}>
        <Card elevation={3} sx={{p:2}}>
        <CardMedia image={worldstate.image} sx={{ height:200}} title={"Image for your world!"}	/>
		<UploadWidget setState={setWorldstate} />
        </Card>
		
		</Grid>
		</Grid>
		<br/>
        <Button type='submit' variant='contained' color='alert' size='large'>Create the World</Button>
		
        </form>
	</Paper>

	)
}

export default CreateWorld;
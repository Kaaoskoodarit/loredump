import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {addCategory} from '../../actions/categoryActions';
//import {Link as RouterLink} from 'react-router-dom'
import UploadWidget from '../Cloudinary/UploadWidget';


//MUI IMPORTS
import { Button, Grid, Typography, Paper, Divider } from '@mui/material';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MultipleSelectChip from './../common/MultipleSelectChip';
import Box from '@mui/material/Box';





const CreateCategory = (props) => {
	// Set state for page
    //NIMEÄ UUDELLEEN STATE
	const [state,setState] = useState({
		title:"",
        custom_url:"",         // custom_url = title
		image:"",
        description:"",
        private_notes:"",
		lore_pages:[]            
	})

    // Add a state to show if a page has been added
    const [addCount,setAddCount] = useState(0);

    // Get token and categorystate from the store
    const worldid = useSelector(state => state.world.page.id);
    const worldurl = useSelector(state => state.world.page.custom_url);
    const categorystate = useSelector(state => state.category.page);
    const lorelist = useSelector(state => state.lore.list)

    // Use dispatch
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle normal onChange events    
    const onChange = (event) => {

        //custom url can be max 50 characters!
        if (event.target.name === "custom_url"&&event.target.value.length === 50) {
            return
        }
        setState((state) => {
            return {
                ...state,
                [event.target.name]:event.target.value
            }
        })
    }

    
    // Handle onSubmit event
    const onSubmit = (event) => {
        event.preventDefault();
        // Add relationships to state
        let category = {
            ...state,
            world_id: worldid
        }

        //REPLACE SPACES WITH UNDERLINE, MAKE THE TITLE AS URL IF NONE SPECIFIED
        //custom url can be max 50 characters! (thus, the SLICE command)
        category.custom_url = category.custom_url === ""? state.title.slice(0,49).replace(/\s+/g, '_') : category.custom_url.replace(/\s+/g, '_')

        // Add the new page to the database
        dispatch(addCategory(worldid,category));
       
        // Reset the state of the page and relationships
        setState({
            title:"",
            custom_url:"",
            image:"",
            description:"",
            private_notes:"",
            lore_pages:[]
        })
        setAddCount(1);
    }

    useEffect(() => {
        if (addCount > 0) {
            console.log(categorystate.custom_url);
            navigate("/"+worldurl+"/category/"+categorystate.custom_url);
        }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[categorystate]);

    //TESTING
    // let testRow = state.lore_pages? state.lore_pages.map((id)=>{<Typography >Lore: {id}</Typography>}):"NA"
    // let testData = 
    // <>
    //     <Typography>Title {state.title}</Typography>
    //     <Typography>Url {state.custom_url}</Typography>
    //     <Typography>Img {state.image}</Typography>
    //     <Typography>Desc {state.description}</Typography>
    //     <Typography>Notes {state.private_notes}</Typography>
    //     {testRow}
    // </>
    
    
    
    return(
		<Paper elevation={3} sx={{ p:2}}>
             <form onSubmit={onSubmit}>
            
		<Grid container spacing={1}>
            <Container>
            <Typography variant='lore'>Create a new Category</Typography>
            </Container>
		

		<Grid item xs={12} sm={8}>
            <Container sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField id="category-title" name="title" label="Title" required multiline maxRows={2}
                value={state.title} onChange={onChange}/>
                <br/>
            <TextField id="category-description" name="description" label="Description" multiline maxRows={10}
                value={state.description} onChange={onChange}/>
            <br/>
            <TextField id="category-private_notes" name="private_notes" label="Private Notes" multiline maxRows={4}
                value={state.private_notes} onChange={onChange}/>
            <br/>
            <TextField id="category-custom_url" name="custom_url" label="Display URL as:" multiline maxRows={4}
                value={state.custom_url} onChange={onChange}/>
            </Container>
		</Grid>
        <Grid item xs={4}>
            <Box sx={{ height:200 }}>
            <img src={state.image}/>
            </Box>
            <Typography variant="h6">Add Image:</Typography>
            <UploadWidget setState={setState} />
        </Grid>
		
		</Grid>
		<Container>
		<br/>
		<Typography variant='loreSmall' >Add Lore to this Category:</Typography>
		<Divider/>
		<br/>	
        <MultipleSelectChip list={lorelist} label={"Lore"} state={state} name="lore_pages" setState={setState}/>
		<br/>
		<br/>
        <Button type='submit' color="success" variant='contained' size='xl'>Create Category</Button>
		
        {/* {testData} */}
		</Container>
		</form>
	</Paper>

	)
	
}

export default CreateCategory;
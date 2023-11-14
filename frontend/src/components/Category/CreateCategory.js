import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {addCategory} from '../../actions/categoryActions';
import {Link as RouterLink} from 'react-router-dom'
import UploadWidget from '../Cloudinary/UploadWidget';


//MUI IMPORTS
import { Button, Grid, Typography, Paper, Divider } from '@mui/material';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import MultipleSelectChip from './../common/MultipleSelectChip';





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

    // Get token and categorystate from the store
    const worldid = useSelector(state => state.world.page.id);
    //const worldurl = useSelector(state => state.world.page.custom_url);
    //const categorystate = useSelector(state => state.category.page);
    const lorelist = useSelector(state => state.lore.list)

    // Use dispatch
    const dispatch = useDispatch();

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

    //OnChange function specifically for Categories
    // const onCatChange = (event) => {

    //     let tempArr =state.categories
    //     //event target = Select html element, ID HAS to be the index of the row
    //     tempArr[event.target.id] = event.target.value
    //     setState(() => {
    //         return{ 
    //             ...state,
    //             [event.target.name]:tempArr
    //            }
    //         })

    // }

    // const getLore = (id) => {
	// 	for (const lore of lorelist){
	// 		if (lore.id === id) return lore
	// 	}
	// 	return id;
	// }


    
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

    }
    const getLoreTitle = (id) => {
		for (const lore of lorelist){
			if (lore.id === id) return lore.title
		}
		return id;
	}

	let lore_listed;
	if(state.lore_pages){
		lore_listed = state.lore_pages.map((id,index)=>{
			let loreTitle = getLoreTitle(id)
			return (
				<Grid item>
				<Chip color="primary" label={loreTitle} component={RouterLink} to={"/category/"+id} 
				clickable />
				</Grid>
			)
		})	
	}
    return(
		<Paper elevation={3} sx={{ p:2}}>
             <form onSubmit={onSubmit}>
            
            <Typography variant='lore'>Create a new Category</Typography>
		<Grid container spacing={2}>
		

		<Grid item xs={8}>
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
		<UploadWidget state={state} setState={setState} />
		
		</Grid>
		<Container>
		<br/>
		<br/>
		<Divider/>
		<Typography variant='loreSmall' >Add Lore to this Category:</Typography>
		<br/>
				
        <MultipleSelectChip list={lorelist} state={state} setState={setState}/>
        <Button type='submit' color="success" variant='contained' size='xl'>Create Category</Button>
		
		</Container>
		</form>

	</Paper>

	)
	
}

export default CreateCategory;
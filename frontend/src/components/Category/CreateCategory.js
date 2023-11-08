import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {addCategory,getCategory} from '../../actions/categoryActions';
import { useNavigate, useParams } from 'react-router-dom';
import UploadWidget from '../Cloudinary/UploadWidget';

//MUI IMPORTS
import { Grid, Typography, Paper, Divider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { Card, CardMedia, CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';




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
    const categorystate = useSelector(state => state.category.page);

    // Use dispatch and navigate
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let {worldurl, id}  = useParams();

    // Handle normal onChange events    
    const onChange = (event) => {
        setState((state) => {
            return {
                ...state,
                [event.target.name]:event.target.value
            }
        })
    }

    //OnChange function specifically for Categories
    const onCatChange = (event) => {

        let tempArr =state.categories
        //event target = Select html element, ID HAS to be the index of the row
        tempArr[event.target.id] = event.target.value
        setState(() => {
            return{ 
                ...state,
                [event.target.name]:tempArr
               }
            })

    }

    
    // Handle onSubmit event
    const onSubmit = (event) => {
        event.preventDefault();
        // Add relationships to state
        let category = {
            ...state,
            creator: props.user
        }
        // Add the new page to the database
        dispatch(addCategory(worldid,category));
        // Redirect to the new Category (getCategory maybe redundant? test after merge!)
        dispatch(getCategory(worldid,categorystate.id));
        navigate("/"+worldid+"/category/"+categorystate.id);
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

    return(
		<Paper elevation={3} sx={{ p:2}}>
		<Grid container spacing={2}>
		

		<Grid item xs={8}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant="lore">{worldurl}</Typography>
		<Typography variant="lore">{state.title}</Typography>

		{/* <Typography variant="h6">Description:</Typography> */}
        <TextField id="category-description" name="description" label="Description" multiline maxRows={10}
            value={state.description} onChange={onChange}/>
		{/* <Typography variant="h6">Private Notes:</Typography> */}
        <br/>
        <TextField id="category-private_notes" name="private_notes" label="Private Notes" multiline maxRows={4}
            value={state.private_notes} onChange={onChange}/>
		
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
		<br/>
		</Container>
		
		<Grid container spacing={3}>
			{/* add more pages */}
		</Grid>
			

	</Paper>

	)
    // return (
    //     <>
    //     <div style={{
	// 		margin:"auto",
	// 		width:"40%",
	// 		textAlign:"left"
	// 	}}>
    //         <form className="mb-5" onSubmit={onSubmit}>
	// 			<label htmlFor="title" className="form-label">Title</label>
	// 			<input type="text"
	// 					name="title"
	// 					id="title"
	// 					className="form-control"
	// 					onChange={onChange}
	// 					value={state.title}/>
    //                 <div id="title-help" className="form-text">
    //                 This will be the title of your Category!
    //                 </div>
    //             <br/>
    //             <br/>
    //             <label htmlFor="image" className="form-label">Image link</label>
	// 			<input type="url"
	// 					name="image"
	// 					id="image"
	// 					className="form-control"
	// 					onChange={onChange}
	// 					value={state.image}/>
    //             <label htmlFor="summary" className="form-label">Summary</label>
	// 			<input type="text"
	// 					name="summary"
	// 					id="summary"
	// 					className="form-control"
	// 					onChange={onChange}
	// 					value={state.summary}/>
    //             <label htmlFor="description" className="form-label">Description</label>
	// 			<input type="text"
	// 					name="description"
	// 					id="description"
	// 					className="form-control"
	// 					onChange={onChange}
	// 					value={state.description}/>
    //             <label htmlFor="notes" className="form-label">Private Notes</label>
	// 			<input type="text"
	// 					name="notes"
	// 					id="notes"
	// 					className="form-control"
	// 					onChange={onChange}
	// 					value={state.private_notes}/>
    //             <select name={"categories"}
    //                         id={index}
    //                         className="form-select"
    //                         aria-label="Select Categories"
    //                         onChange={onCatChange}>
    //                     <option key={"selected"} value={state.categories[index]}>{selectedText}</option>
    //             </select>
    //             <br/>
    //             <input type="submit" className="btn btn-primary" value="Create new Lore Page"/>
    //         </form>
    //     </div>
    //      </>
    // )
	
}

export default CreateCategory;
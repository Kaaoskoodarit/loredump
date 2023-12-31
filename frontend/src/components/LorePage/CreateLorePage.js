import {useState, useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {addPage} from '../../actions/pageActions';
//import {editCategory,getCategoryList} from '../../actions/categoryActions';
import Connections from './Relationships';
import { useNavigate } from 'react-router-dom';
import MultipleSelectChip from './../common/MultipleSelectChip';
import UploadWidget from '../Cloudinary/UploadWidget';
//MATERIAL UI IMPORTS
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import { Button, Paper } from '@mui/material';
import { Container } from '@mui/system';
import ImageCard from '../common/ImageCard';


const CreateLorePage = (props) => {
	// Set state for page
    //NIMEÄ UUDELLEEN STATE
	const [state,setState] = useState({
		title:"",
        custom_url:"",
		categories:[],
		image:"",
        summary:"",
        description:"",
        connections:[{
            type:"",             // Change names reltype -> connection
            target_id:""            // ----> change everywhere!!!!!!!!!
        }],
        private_notes:""            // notes -> private_notes
	})    

    // Add a state to show if a page has been added
    const [addCount,setAddCount] = useState(0);

    // Get token and pagestate from the store
    const worldid = useSelector(state => state.world.page.id);
    const worldurl = useSelector(state => state.world.page.custom_url); 
    const pagestate = useSelector(state => state.lore.page);
    const categorylist = useSelector(state => {
        let categorylist = [...state.category.list];
        categorylist.splice(0,1);
        return categorylist  
    });

    // Use dispatch and navigate
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Create preview image:
    const default_img = 'https://res.cloudinary.com/kaaoskoodarit/image/upload/v1700154823/book-with-glasses_gfbjmm.png'
	const image = (state.image !== 'error.jpg' && state.image !== "") ? state.image : default_img

   
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
        
        let page = {
            ...state,
           // categories: state.categories.filter(cat=>)
            world_id: worldid
        }

        //REPLACE SPACES WITH UNDERLINE, MAKE THE TITLE AS URL IF NONE SPECIFIED
        //custom url can be max 50 characters! (thus, the SLICE command)
        page.custom_url = page.custom_url === ""? state.title.slice(0,49).replace(/\s+/g, '_') : page.custom_url.replace(/\s+/g, '_')
       
        // Add the new page to the database
        dispatch(addPage(worldid,page));

        // Redirect to the new page
        //dispatch(getPage(worldid,pagestate.id));

        // Reset the state of the page and relationships
        /* 
        setState({
            title:"",
            custom_url:"",
            categories:[],
            image:"",
            summary:"",
            description:"",
            connections:[{
                type:"",
                target_id:""
            }],
            private_notes:""
        })
        */
        setAddCount(1);
    }

    useEffect(() => {
        if (addCount > 0) {
            console.log(pagestate.custom_url);
            navigate("/"+worldurl+"/lorepage/"+pagestate.custom_url);
        }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[pagestate]);

    return (
        <Paper elevation={3} sx={{p:2}}>
            <form className="mb-5" onSubmit={onSubmit}>

        <Grid container rowSpacing={2}>
            <Container>
            <Typography variant="lore">Create a new Lore Page</Typography>
            </Container>
            <Grid item sm={12} md={8}>
                <Container sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* <Typography variant="lore">{page.title}</Typography> */}
                    <TextField id="lore-title" name="title" label="Title" required multiline maxRows={2}
                    value={state.title} onChange={onChange}/>

                {/* <Grid container spacing={1}> */}
                <br/>
                <MultipleSelectChip list={categorylist} label={"Categories"} state={state} name="categories" setState={setState}/>

                {/* <AssignCategories state={state} setState={setState} onChange={onCatChange}/> */}
                {/* </Grid> */}
                <br/>
                
                <TextField id="lore-description" name="description" label="Description" multiline maxRows={10}
                    value={state.description} onChange={onChange}/>
                    <br/>
                <TextField id="lore-private_notes" name="private_notes" label="Private Notes" multiline maxRows={4}
                    value={state.private_notes} onChange={onChange}/>
                <br/>
                <TextField id="lore-custom_url" name="custom_url" label="Display URL as:" multiline maxRows={4}
                value={state.custom_url} onChange={onChange}/>
                </Container>

                </Grid>
                <Grid item xs>
                    <ImageCard page={state}/>
                    <Typography variant="h6">Add Image:</Typography>
                    <UploadWidget setState={setState} />
                    <Typography variant="h6">Summary:</Typography>

                    <TextField id="lore-summary" fullWidth name="summary" label="Summary" multiline maxRows={4}
                    value={state.summary} onChange={onChange}/>
                    <br/>
                    
                    {/* <ConnectionSelect label={"Connections"} state={state} name="connections" setState={setState}/> */}
                    <Connections state={state} setState={setState}/>
                </Grid>
        <Container>
            <Button type='submit' color="success" variant='contained' size='xl'>Create new Lore Page</Button>
        </Container>
        </Grid>
        </form>

			

        </Paper>


    )
	
}

export default CreateLorePage;
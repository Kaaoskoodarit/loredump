import {useState, useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {addPage} from '../../actions/pageActions';
//import {editCategory,getCategoryList} from '../../actions/categoryActions';
import Connections from './Relationships';
import { useNavigate } from 'react-router-dom';
import AssignCategories from './AssignCategories'
import UploadWidget from '../Cloudinary/UploadWidget';
//MATERIAL UI IMPORTS
import Typography from '@mui/material/Typography';


import { Button, Divider, Paper } from '@mui/material';
import { Container } from '@mui/system';


const CreateLorePage = (props) => {
	// Set state for page
    //NIMEÄ UUDELLEEN STATE
	const [state,setState] = useState({
		title:"",
        custom_url:"",
		categories:["Uncategorised"],
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
    //const categorylist = useSelector(state => state.category.list);

    // Use dispatch and navigate
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Create preview image:
    const default_img = 'https://res.cloudinary.com/kaaoskoodarit/image/upload/v1699876476/user_uploads/skrd5vixnpy7jcc0flrh.jpg'
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
        setAddCount(1);
    }

    useEffect(() => {
        if (addCount > 0) {
            console.log(pagestate.custom_url);
            navigate("/"+worldurl+"/lorepage/"+pagestate.custom_url);
        }  
    },[pagestate]);

    return (
        <Paper sx={{p:2, alignItems:"center"}}>
            <Container >
            <form className="mb-5" onSubmit={onSubmit}>
            <Typography variant="loreSmall">ADD A NEW LORE PAGE</Typography>
            <Divider/>
            <Typography variant="h6">Title:</Typography>
				<input type="text"
						name="title"
						id="title"
						className="form-control"
						onChange={onChange}
						value={state.title}/>
                <Typography variant="subtitle">This will be the title of your Lore Page!</Typography>

                <AssignCategories state={state} setState={setState} onChange={onCatChange}/>
                <br/>
                <br/>
                <Typography variant="h6">Add Image:</Typography>
                <br/>
                <UploadWidget state={state} setState={setState} />
                <br/>
                <br/>
                {/* <img key={image} src={image} style={{'maxWidth':200, 'maxHeight':200}} alt={""}></img> */}
                <br/>
                <br/>
                <Typography variant="h6">Summary:</Typography>
				<input type="text"
						name="summary"
						id="summary"
						className="form-control"
						onChange={onChange}
						value={state.summary}/>
                <Typography variant="h6">Description:</Typography>
				<input type="text"
						name="description"
						id="description"
						className="form-control"
						onChange={onChange}
						value={state.description}/>
                <Connections state={state} setState={setState}/>
                <br/>
                <br/>
                <Typography variant="h6">Private Notes:</Typography>
				<input type="text"
						name="private_notes"
						id="private_notes"
						className="form-control"
						onChange={onChange}
						value={state.private_notes}/>
                <Typography variant="h6">Custom Url:</Typography>
				<input type="text"
						name="custom_url"
						id="custom_url"
						className="form-control"
						onChange={onChange}
						value={state.custom_url}/>
                <br/>
                <br/>
                <br/>
                <Button type='submit' variant='contained' size='xl'>Create new Lore Page</Button>
            </form>
            </Container>
            
        </Paper>

    )
	
}

export default CreateLorePage;
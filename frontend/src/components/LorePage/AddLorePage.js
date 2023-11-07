import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {addPage,getPage} from '../../actions/pageActions';
import {editCategory,getCategoryList} from '../../actions/categoryActions';
import Connections from './Relationships';
import { useNavigate } from 'react-router-dom';
import AssignCategories from './AssignCategories'
import UploadWidget from '../Cloudinary/UploadWidget';

const AddLorePage = (props) => {
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

    // Get token and pagestate from the store
    const worldid = useSelector(state => state.world.page.id);
    //const worldurl = useSelector(state => state.world.page.custom_url);  // when transitioning from ids to urls
    const pagestate = useSelector(state => state.lore.page);
    const categorylist = useSelector(state => state.category.list);

    // Use dispatch and navigate
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Create preview image:
    const default_img = '../../shepherd-dog-defaultimg.jpg'
	const image = (state.image !== 'error.jpg' && state.image !== "") ? state.image : default_img

   
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

    //FUNCTION FOR ADDING ONE LINK TO ONE CATEGORY
    const editACategory = (category,page_id) => {
        const tempData = category.links.concat(page_id)
        const tempCat = {
            ...category,
            links:tempData
        }
        console.log("Dispatching edit on category",tempCat)
        dispatch(editCategory(worldid,tempCat));
    }

    //get list of all categories with all their data so I can take the category.links:[] from each at onSubmit
    const linkCategories = (page_id) =>{

        //get full list of categories
        dispatch(getCategoryList(worldid))
        
        // iterate through categories in the list
        for (let thiscategory of categorylist)
            if (state.categories.includes(thiscategory.id)) {
                editACategory(thiscategory,page_id)
            }
        }

    
    // Handle onSubmit event
    const onSubmit = (event) => {
        event.preventDefault();
        let page = {
            ...state,
            creator: props.user
        }
        // Add the new page to the database
        dispatch(addPage(worldid,page));
        // Redirect to the new page
        dispatch(getPage(worldid,pagestate.id));
        navigate("/api/worlds/"+worldid+"/lore-pages/"+pagestate.id);
        linkCategories(pagestate.id)
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
    }

    return (
        <>
        <div style={{
			margin:"auto",
			width:"40%",
			textAlign:"left"
		}}>
            <form className="mb-5" onSubmit={onSubmit}>
				<label htmlFor="title" className="form-label">Title</label>
				<input type="text"
						name="title"
						id="title"
						className="form-control"
						onChange={onChange}
						value={state.title}/>
                    <div id="title-help" className="form-text">
                    This will be the title of your Lore Page!
                    </div>
                <AssignCategories state={state} setState={setState} onChange={onCatChange}/>
                <br/>
                <br/>
                <label htmlFor="image" className="form-label">Add Image:</label>
                <br/>
                <UploadWidget state={state} setState={setState} />
                <br/>
                <br/>
                <img key={image} src={image} style={{'maxWidth':200, 'maxHeight':200}} alt={""}></img>
                <br/>
                <br/>
                {/*
                <label htmlFor="image" className="form-label">Image link</label>
				<input type="url"
						name="image"
						id="image"
						className="form-control"
						onChange={onChange}
						value={state.image}/>
                */}
                <label htmlFor="summary" className="form-label">Summary</label>
				<input type="text"
						name="summary"
						id="summary"
						className="form-control"
						onChange={onChange}
						value={state.summary}/>
                <label htmlFor="description" className="form-label">Description</label>
				<input type="text"
						name="description"
						id="description"
						className="form-control"
						onChange={onChange}
						value={state.description}/>
                <Connections state={state} setState={setState}/>
                <br/>
                <br/>
                <label htmlFor="notes" className="form-label">Private Notes</label>
				<input type="text"
						name="notes"
						id="notes"
						className="form-control"
						onChange={onChange}
						value={state.private_notes}/>
                <br/>
                <input type="submit" className="btn btn-primary" value="Create new Lore Page"/>
            </form>
        </div>
         </>
    )
	
}

export default AddLorePage;
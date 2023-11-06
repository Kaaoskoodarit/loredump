import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {getCategory} from '../../actions/categoryActions';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Paper, Container } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { getPage } from '../../actions/pageActions';
import {Link as RouterLink} from 'react-router-dom'
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';

//page: list, page, error


const LorePage = (props) => {

	// Get token and list from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			token:state.login.token,
            page:state.page.page,
			categorylist: state.category.list
		}
	})
    const page = appState.page
	const categorylist = appState.categorylist
	const [errorState,setErrorState] = useState(0)

	//ID RECIEVED FROM ROUTER URL
	let { id } = useParams();
	const [loading,setLoading] = useState("");


    // Use dispatcer from react-redux
	const dispatch = useDispatch();
	// use navigate from react-router-dom
	const navigate = useNavigate();

	
	if (page.id !== id && loading===""){
		setLoading (<CircularProgress color="inherit" />);
		dispatch(getPage(appState.token,id));
	} else if (page.id ===id &&loading!=="") {setLoading("")}
	

	//IMAGES
	const default_img = 'https://media.discordapp.net/attachments/1161992163765256203/1169189304220782662/image.png?ex=65547f64&is=65420a64&hm=32e108ff3fe3bb4e9bb89feed07a87015edb99fcc6a8f1d1ecc6b2ae8d4f0017&='
	const image = (page.image !== 'error.jpg' && page.image !== "") ? page.image : default_img


	
	// //This kinda infiniloops oops
    // const loadCategory = (id) => {
	// 	console.log("got catpaged")
    //     dispatch(getCategory(appState.token,id));
    // }
	

    // const removeAPage = (id) => {
	// 	dispatch(removePage(appState.token,id));
	// }

    // const editAPage = (page) => {
	// 	dispatch(editPage(appState.token,page));
	// }


	//Handler for the clickable link buttons in Row component
	const handleNavigate = (id) => {
		console.log("Handlenavigate ",errorState )

		if (!id){
			console.log("No Category found. Navigating to Home")
			navigate("/")
		} else {
			setErrorState(errorState+1)
			if(errorState<10){

				//The actual code:::
				console.log("Navigating to category id",id)
				dispatch(getCategory(appState.token,id));
				navigate("/category/"+id)


			} else console.log("Over 10 Get category attempts!")
		}
	}

	const getCategoryTitle = (id) => {
		for (const category of categorylist){
			if (category.id === id) return category.title
		}
		return id;
	}

	let categories_listed;
	if(page.categories){
		categories_listed = page.categories.map((id,index)=>{
			let categoryTitle = getCategoryTitle(id)
			return (
			<Link key={index+id} color="alert" underline="hover" component={RouterLink} 
			to={"/category/"+id}>{categoryTitle}</Link>
			)
		})	
	}

	return(
		<Container maxWidth="sm">
		<Paper elevation={3}>
		
		{loading}
            {/* {categoryList} */}
            {/* <Link to category */}
		<h2>{page.title}</h2>
		<Card sx={{ maxWidth: 500 }}>
		<CardMedia
			sx={{ height:200, maxWidth: 200 }}
			image={image}
			title={"Image for "+page.title}
		/>
		<Typography variant="h6">Summary:</Typography>
		<Typography variant="body1">{page.summary}</Typography>
		</Card>
		
		<Typography variant="h6">Description:</Typography>
		<Typography variant="body1">{page.description}</Typography>
		<Typography variant="h6">Relationships:</Typography>
		<Typography variant="body1">TBD</Typography>
		<Typography variant="h6">Notes:</Typography>
		<Typography variant="body1">{page.notes}</Typography>

                {/* <td>{page.relationships}</td> */}
		<Typography variant="h6">Categories:</Typography>
		<Stack>{categories_listed}</Stack>
        </Paper>
		</Container>
        
	)
}
export default LorePage;
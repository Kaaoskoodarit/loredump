import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Paper, Container, CardActionArea } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { getPage } from '../../actions/pageActions';
import {Link as RouterLink} from 'react-router-dom'
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


//page: list, page, error


const LorePage = (props) => {

	// Get token and list from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			token:state.login.token,
            page:state.page.page,
            pagelist:state.page.list,
			categorylist: state.category.list
		}
	})
    const page = appState.page
	const pagelist = appState.pagelist
	const categorylist = appState.categorylist
	//const [errorState,setErrorState] = useState(0)
	const [open, setOpen] = useState(false);

	const [tab, setTab] = useState('1');

	const handleChange = (event, newValue) => {
		setTab(newValue);
	};


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

	
	const handleClickOpen = () => {
		setOpen(true);
	  };
	
	  const handleClose = () => {
		setOpen(false);
	  };
	

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


	// //Handler for the clickable link buttons in Row component
	// const handleNavigate = (id) => {
	// 	console.log("Handlenavigate ",errorState )

	// 	if (!id){
	// 		console.log("No Category found. Navigating to Home")
	// 		navigate("/")
	// 	} else {
	// 		setErrorState(errorState+1)
	// 		if(errorState<10){

	// 			//The actual code:::
	// 			console.log("Navigating to category id",id)
	// 			dispatch(getCategory(appState.token,id));
	// 			navigate("/category/"+id)


	// 		} else console.log("Over 10 Get category attempts!")
	// 	}
	// }

	//INSERT CODE FOR REMOVING A CATEGORY
	const handleDelete = () => {
		console.log("Insert code for removing category")
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
				<Grid item>
				<Chip color="primary" label={categoryTitle} component={RouterLink} to={"/category/"+id} 
				clickable />
				</Grid>
			)
		})	
	}

	const getConnectionTitle = (id) => {
		for (const lore of pagelist){
			if (lore.id === id) return lore.title
		}
		return id;
	}

	let connections_listed;
	if(page.relationships){
		connections_listed = page.relationships.map((connection)=>{
			if(connection.target!==""&&connection.reltype!==""){
				let connectionTitle = getConnectionTitle(connection.target)
				return (
					<Grid item >
						<Stack direction='row' alignItems="center" spacing={0.5}>
						<Typography variant='body2'>
						{connection.reltype+":"}
						</Typography>
						<Chip color="primary" label={connectionTitle} component={RouterLink} to={"/lorepage/"+connection.target} 
						clickable />
						</Stack>
					</Grid>
				)
			} else {return ("")}
			
		})	
	}
	// IF CONNECTIONS LISTED RETURNED A BLANK LIST, WRITE NONE
	if (connections_listed.length ===1 && connections_listed[0]===""){
		connections_listed=<Grid item>None</Grid>
	}

	

	return(
		
	<Paper elevation={3} sx={{ p:2}}>
	<Grid container spacing={2}>
	{loading}
	<Grid item xs={8}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant="lore">{page.title}</Typography>
		<Typography variant="subtitle">Categories:</Typography>
		<Grid container spacing={1}>
		{categories_listed}
		</Grid>
		<br/>
		<Typography variant="h6">Description:</Typography>
		<Typography variant="body1">{page.description}</Typography>
		<Typography variant="h6">Notes:</Typography>
		<Typography variant="body1">{page.notes}</Typography>

			<TabContext value={tab}>
			<TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary">
				<Tab label="Summary" value="1"/>
				<Tab label="Categories" value="2"/>
			</TabList>
			<TabPanel value="1">
				<Typography variant="body2" >
				{page.summary}
				</Typography>
			</TabPanel>
			<TabPanel value="2">
				<Stack>{categories_listed}</Stack>
			</TabPanel>
			</TabContext>

		</Container>
	</Grid>
	<Grid item xs={4}>
		<Card elevation={3} sx={{ p:1, maxWidth:300 }}>
			<CardActionArea onClick={handleClickOpen}>
			<CardMedia
			sx={{ height:200}}
			image={image}
			title={"Image for "+page.title}	
			/>
			</CardActionArea>
		
		 <Dialog
        open={open}
        onClose={handleClose}
        aria-label="image-dialog"
      >
		<DialogContent maxWidth="1000" maxHeight="1000" >
			<img height='100%' width='100%' src={image}/>
		</DialogContent>
	  </Dialog>
		<Typography variant="h6">Summary:</Typography>
		<Typography color="secondary.dark" variant="body1">{page.summary}</Typography>
		<Typography variant="h6">Connections:</Typography>
		<Grid container spacing={1}>
		{connections_listed}
		</Grid>
		</Card>
	</Grid>
	</Grid>

		
    </Paper>
        
	)
}
export default LorePage;
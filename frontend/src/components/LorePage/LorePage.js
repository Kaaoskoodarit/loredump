import {useState, useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { getPage } from '../../actions/pageActions';
import {Link as RouterLink} from 'react-router-dom'
//import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Card, Paper, Container, CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
//import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
//import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


//page: list, page, error


const LorePage = (props) => {

	// Get token and list from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			worldid:state.world.page.id,
            page:state.lore.page,
            pagelist:state.lore.list,
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
	let {worldurl, url}  = useParams();

	const [loading,setLoading] = useState("");


    // Use dispatcer from react-redux
	const dispatch = useDispatch();
	// use navigate from react-router-dom
	//const navigate = useNavigate();
	
	useEffect(() => {
		dispatch(getPage(appState.worldid,page.id));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])
	
	
	if (page.custom_url !== url && loading===""){
		setLoading (<CircularProgress color="inherit" />);
		// Get page id based on url:
		if (pagelist) {
			for (let page of pagelist) {
					if (page.custom_url === url) {
					// If find a match, dispatch getPage to update page state
					dispatch(getPage(appState.worldid,page.id));
					break;
				}
			}
		}
	} else if (page.custom_url === url && loading!=="") {setLoading("")}

	
	const handleClickOpen = () => {
		setOpen(true);
	  };
	
	  const handleClose = () => {
		setOpen(false);
	  };
	

	//IMAGES
	const default_img = 'https://res.cloudinary.com/kaaoskoodarit/image/upload/v1699876476/user_uploads/skrd5vixnpy7jcc0flrh.jpg'
	const image = (page.image !== 'error.jpg' && page.image !== "") ? page.image : default_img


	
	
    // const removeAPage = (id) => {
	// 	dispatch(removePage(appState.token,id));
	// }

    // const editAPage = (page) => {
	// 	dispatch(editPage(appState.token,page));
	// }



	//INSERT CODE FOR REMOVING A CATEGORY
	const handleDelete = () => {
		console.log("Insert code for removing category")
	}

	const getCategoryData = (id) => {
		for (const category of categorylist){
			if (category.id === id) return category
		}
		//MATCH WAS NOT FOUND
		return "Lost Link";
	}

	let categories_listed;
	if(page.categories){
		categories_listed = page.categories.map((id,index)=>{
			
			let category = getCategoryData(id)
			return (
				<Grid item>
				<Chip color="primary" label={category.title} component={RouterLink} to={"/"+worldurl+"/category/"+category.custom_url} 
				clickable />
				</Grid>
			)
		})	
	}

	const getConnectionData = (id) => {
		for (const lore of pagelist){
			if (lore.id === id) return lore
		}
		//MATCH WAS NOT FOUND
		return "Lost Link";
	}

	let connections_listed;
	if(page.connections){
		connections_listed = page.connections.map((connection)=>{
			if(connection.target_id!==""&&connection.type!==""){
				let lore = getConnectionData(connection.target_id)
				return (
					<Grid item >
						<Stack direction='row' alignItems="center" spacing={0.5}>
						<Typography variant='body2'>
						{connection.type+":"}
						</Typography>
						<Chip color="primary" label={lore.title} component={RouterLink} to={"/"+worldurl+"/lorepage/"+lore.custom_url} 
						clickable />
						</Stack>
					</Grid>
				)
			} else {return ("")}	
		})	
	}

	// // IF CONNECTIONS LISTED RETURNED A BLANK LIST, WRITE NONE
	if (!page.connections){
		connections_listed=<Grid item>None</Grid>
	}

	

	return(
		
	<Paper elevation={3} sx={{ p:2}}>
	<Grid container spacing={2}>
	
	<Grid item xs={8}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant="lore">{page.title}</Typography>
		{loading}
		<Typography variant="subtitle">Categories:</Typography>
		<Grid container spacing={1}>
		{categories_listed}
		</Grid>
		<br/>
		<Typography variant="h6">Description:</Typography>
		<Typography variant="body1">{page.description}</Typography>
		<Typography variant="h6">Notes:</Typography>
		<Typography variant="body1">{page.private_notes}</Typography>

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
		<DialogContent sx={{maxWidth:"1000", maxHeight:"1000"}}>
			<img height='100%' width='100%' src={image} alt={"Image for "+page.title}/>
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
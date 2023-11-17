import {useState, useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { useParams,useNavigate } from 'react-router-dom';
import {removePage,editPage} from '../../actions/pageActions';

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
import TextField from '@mui/material/TextField';
import UploadWidget from '../Cloudinary/UploadWidget';
import Connections from './Relationships';
import ImageCard from '../common/ImageCard';
import MultipleSelectChip from '../common/MultipleSelectChip';
import {DialogActions, DialogTitle, DialogContentText }  from '@mui/material';
import Button from '@mui/material/Button';



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
	const worldid = appState.worldid
    const page = appState.page
	const pagelist = appState.pagelist
	const categorylist = appState.categorylist
	//const [errorState,setErrorState] = useState(0)


	//mode for page's State : default, edit, remove
	const [mode,setMode] = useState("default")
	const [editState,setEditState] = useState({
		...page
	})

	const [open, setOpen] = useState(false);

	const [tab, setTab] = useState('1');

	const handleChange = (event, newValue) => {
		setTab(newValue);
	};


	//ID RECIEVED FROM ROUTER URL	
	let {worldurl, url}  = useParams();

	//const [loading,setLoading] = useState(false);


    // Use dispatcer from react-redux
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	useEffect(() => {
	// Get page id based on url:
	if (pagelist) {
		let found = false;
		for (let page of pagelist) {
			if (page.custom_url === url) {
				// If find a match, dispatch getPage to update page state
				dispatch(getPage(appState.worldid,page.id));
				found = true;
				break;
			}
		}
		if (!found) {
			navigate("/");
		}
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[url,pagelist])
	
		
	//display loading icon if the page is still waiting on server
	const [loading,setLoading] = useState(false);
	
	if (page.custom_url !== url && loading===false){
		setLoading (true);
	} else if (page.custom_url === url && loading!==false) {
		setEditState({...page});
		setLoading(false)}

	
	const handleClickOpen = () => {
		setOpen(true);
	  };
	
	  const handleClose = () => {
		setOpen(false);
	  };
	

	//IMAGES
	const default_img = 'https://res.cloudinary.com/kaaoskoodarit/image/upload/v1700154823/book-with-glasses_gfbjmm.png'
	const image = (page.image !== 'error.jpg' && page.image !== "") ? page.image : default_img


	// Handle normal onChange events    
	const onChange = (event) => {
		
		//custom url can be max 50 characters!
		if (event.target.name === "custom_url"&&event.target.value.length === 50) {
			return
		}
		setEditState((editState) => {
			return {
				...editState,
				[event.target.name]:event.target.value
			}
		})
	}
	const removeAPage = () => {
		dispatch(removePage(worldid,page.id));
		setMode("default");
		return;
	}

	const editAPage = () => {
		let tempPage = {...editState}
		//*REPLACE SPACES WITH UNDERLINE, MAKE THE TITLE AS URL IF NONE SPECIFIED
        //custom url can be max 50 characters! (thus, the SLICE command)
        tempPage.custom_url = tempPage.custom_url === ""? editState.title.slice(0,49).replace(/\s+/g, '_') : tempPage.custom_url.replace(/\s+/g, '_')

		dispatch(editPage(worldid,tempPage));
		setMode("default");

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
				<Grid item key={index+":"+id}>
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
		connections_listed = page.connections.map((connection,index)=>{
			if(connection.target_id!==""&&connection.type!==""){
				let lore = getConnectionData(connection.target_id)
				return (
					<Grid item key={index+":"+connection.target_id}>
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
	
	// IF CONNECTIONS LISTED RETURNED A BLANK LIST, WRITE NONE
	 if (!page.connections||page.connections[0].target_id===""){
		connections_listed=<Grid item key="None">None</Grid>
	}

		//  change the state of the system, 
	// changing between "remove", "edit" and "default" mode
	let actionButtons;
	
	if (mode==="remove"){
		actionButtons = <>
		<Button size="small" disabled variant="contained" color="secondary" onClick={() => setMode("edit")}
			>Edit</Button>
		<Button size="small" disabled variant="contained" color="alert" onClick={() => setMode("remove")}
			>Delete Lore</Button>
			</>}
	
	if(mode === "edit") {
		actionButtons = <>
		<Button size="small" variant="contained" color="secondary" onClick={() => setMode("default")}
			>Cancel</Button>
		<Button size="small" variant="contained" color="success" onClick={editAPage}
			>Save</Button>
			</>}
	
	if (mode === "default"){
		actionButtons = <>
		<Button size="small" variant="contained" color="secondary" onClick={() => setMode("edit")}
			>Edit</Button>
		<Button size="small" variant="contained" color="alert" onClick={() => setMode("remove")}
			>Delete Lore</Button>
			</>}


	//*DEFAULT LAYOUT
	let content;
	if (mode==="default"||"delete"){
		content = <>
		
	<Grid item xs={12} sm={8} order={{xs:2, md:1}}>
		<Container order={{sm:2,md:1}}>
		<Typography variant="lore">{page.title}</Typography>
		<Typography variant="h6">Categories:</Typography>
		<Grid container spacing={1}>
		{categories_listed}
		</Grid>
		<br/>
		{page.description&&<Typography variant="h6">Description:</Typography>}
		<Typography variant="body1">{page.description}</Typography>
		{page.private_notes&&<Typography variant="h6">Notes:</Typography>}
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
	<Grid item xs order={{xs:1,sm:2}}>
	<Stack direction="row" justifyContent="flex-end" spacing={1}>
				{actionButtons}
			</Stack>
	<br/>
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
		{page.summary&&<Typography variant="h6">Summary:</Typography>}
		<Typography color="secondary" variant="body1">{page.summary}</Typography>
		<Typography variant="h6">Connections:</Typography>
		<Grid container spacing={1}>
		{connections_listed}
		</Grid>
		</Card>
	</Grid>
		</>}

if (mode==="edit"){
	content = <>
	<Grid item xs={12} sm={6} md={8} order={{xs:2,sm:1}}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant='loreSmall'>Edit Lore Page</Typography>
		<br/>
		<TextField id="lore-title" size='small' name="title" label="Title" required multiline maxRows={2}
                value={editState.title} onChange={onChange}/>
		<br/>
		<TextField id="lore-description" size='small' name="description" label="Description" multiline maxRows={10}
                value={editState.description} onChange={onChange}/>
		<br/>
		<TextField id="lore-private_notes" size='small' name="private_notes" label="Private Notes" multiline maxRows={4}
			value={editState.private_notes} onChange={onChange}/>
		<br/>
		<TextField id="lore-custom_url" size='small' name="custom_url" label="Display URL as:" multiline maxRows={4}
                value={editState.custom_url} onChange={onChange}/>
		<br/>
		<MultipleSelectChip list={categorylist} label={"Categories"} state={editState} name="categories" setState={setEditState}/>
		</Container>
		</Grid>
		
		<Grid item xs={4} order={{xs:1,sm:2}} >
			<Stack direction="row" justifyContent="flex-end" spacing={1}>
				{actionButtons}
			</Stack>
			<br/>
			<ImageCard page={editState}/>
			
			<UploadWidget setState={setEditState}/>
			<br/>

			<TextField id="lore-summary" fullWidth size='small' name="summary" label="Summary" multiline maxRows={4}
			value={editState.summary} onChange={onChange}/>
			<br/>
			<Connections state={editState} setState={setEditState}/>
		</Grid>
	</>}

	return(
		
	<Paper elevation={3} sx={{ p:2}}>
		
	<Grid container rowSpacing={2}>
	{content}
	
		
		
	</Grid>

	<Dialog fullWidth maxWidth='sm' open={mode==="remove"} onClose={()=>setMode("default")} aria-label="confirm-delete-dialog">
        <DialogTitle>
			Deleting Lore: {page.title}</DialogTitle>
		<DialogContent >
			<DialogContentText> 
				This action cannot be undone.</DialogContentText>
		</DialogContent>
		<DialogActions >
		<Button autoFocus  variant="contained" color="secondary" onClick={() => setMode("default")}
			>Cancel</Button>
		<Button variant="contained" color="alert" onClick={removeAPage}
			>Delete Lore Page</Button>
		</DialogActions>
        </Dialog>
		
    </Paper>
        
	)
}
export default LorePage;
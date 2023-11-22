import Navbar1 from './components/Navbar1';
import Navbar2 from './components/Navbar2';
import LoginPage from './components/LoginPage';
import {Route,Routes,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import CreateLorePage from './components/LorePage/CreateLorePage';
import Category from './components/Category/Category';
import LorePage from './components/LorePage/LorePage';
import ListPages from './components/Category/ListPages';
import World from './components/World';

//*IMPORTS FOR WORLD THEME
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {themeBlueBook, themeOrangeBook, themeDark} from './theme';

// Temp until we get user page!
import {getList} from './actions/pageActions';
import {getCategoryList} from './actions/categoryActions';
import { getWorld,getWorldList } from './actions/worldActions';
import {useDispatch} from 'react-redux';
import { Container} from '@mui/material';
import CreateCategory from './components/Category/CreateCategory';
import CreateWorld from './components/CreateWorld';
import LoadingIndicator from './components/common/LoadingIndicator';

// Main App component
function App() {
	
	// "Selects" data to be used from the state of the "store"
	const appState = useSelector((state) => {
		let error = state.login.error || state.world.error || state.category.error || state.lore.error
		// Returns only "isLogged", "error" and "loading" parts of state

		return {
			isLogged:state.login.isLogged,
			error:error,
			loading:state.login.loading,
			user :state.login.user,
			theme:state.login.theme,
			worldlist:state.world.list,
			worldpage:state.world.list,
			worldurl: state.world.page.custom_url
		}
	})

	//*SELECT THEME
	const [theme,setTheme] = useState(themeDark);

	useEffect(()=>{
	switch (appState.theme){
		case "Orange": setTheme(themeOrangeBook); return
		case "Nautical": setTheme(themeBlueBook); return
		case "Dark": setTheme(themeDark); return
		default: setTheme(themeDark); return
		
	}
		
	},[appState.theme])

	const dispatch = useDispatch();

	useEffect(() => {
		if (appState.isLogged && appState.worldlist.length < 1) {
			dispatch(getWorldList());
		} else if (appState.isLogged && appState.worldlist) {
			if (appState.worldlist.length > 0) {
				for (let world of appState.worldlist) {
					if (world.creator_id === appState.user) {
						const worldid = world.id;
						dispatch(getWorld(worldid));
						dispatch(getList(worldid));			
						dispatch(getCategoryList(worldid));
						return;
					}
				}
				console.log("No worlds created yet!")
			} else {
				console.log("No worlds created yet!")
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[appState.isLogged,appState.worldlist.length,appState.user])

	//RENDERING
	
	// Set message to announce state of the app


	
	let message = <></>
	if(appState.loading) {
		message = <LoadingIndicator open={appState.loading}/>
	}
	if(appState.error) {
		message = <h4>{appState.error}</h4>
	}
	// If user is logged in, show Navbar, "message" and content
	// depending on the URL accessed. Routes are available paths.
	if(appState.isLogged&&appState.worldlist&&appState.worldlist.length>0) {
		return (
			<ThemeProvider theme={theme}>
		    <CssBaseline enableColorScheme/>

			<Container>
				<Navbar1/>
				<Navbar2 worldurl={appState.worldurl}/>
				<div style={{height:35,textAlign:"center"}}>
					{message}
				</div>
				<Routes>
					<Route path="/" element={<World/>}/>
					<Route path="/:worldurl" element={<ListPages />}/>
					<Route path="/:worldurl/new-category" element={<CreateCategory user={appState.user}/>}/>
					<Route path="/:worldurl/new-page" element={<CreateLorePage user={appState.user}/>}/>
					<Route path="/:worldurl/category" element={<Category/>}/>
					<Route path="/:worldurl/category/undefined" element={<ListPages/>}/>
					<Route path="/:worldurl/category/:url" element={<Category/>}/>
					<Route path="/:worldurl/lorepage" element={<ListPages />}/>
					<Route path="/:worldurl/lorepage/undefined" element={<ListPages/>}/>
					<Route path="/:worldurl/lorepage/:url" element={<LorePage/>}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</Container>
			</ThemeProvider>
		);
		//OTHERWISE, IF THERE IS NO WORLDS YET, SHOW CREATE WORLD PAGE
	} else if (appState.isLogged&&appState.worldlist.length===0) {
		return (
			<ThemeProvider theme={theme}>
    		<CssBaseline enableColorScheme/>
			


			<Container>
				<Navbar1/>
				<p>No worlds yet.</p>
				<div style={{height:35,textAlign:"center"}}>
					{message}
				<Routes>
					<Route path="/" element={<CreateWorld/>}/>
					<Route path="/*" element={<Navigate to="/"/>}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
				</div>
			</Container>
			</ThemeProvider>
			);
		} else {
		// Otherwise show Navbar, "message" and LoginPage
		return (
			<ThemeProvider theme={theme}>
	    <CssBaseline enableColorScheme/>

			<Container>
				<Navbar1 />
				<div style={{height:35,textAlign:"center"}}>
					{message}
				</div>
				<Routes>
					<Route path="/" element={<LoginPage />}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</Container>
			</ThemeProvider>
			
		);		
		
	}
}

export default App;

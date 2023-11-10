import Navbar1 from './components/Navbar1';
import Navbar2 from './components/Navbar2';
import LoginPage from './components/LoginPage';
import {Route,Routes,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect } from 'react';
import AddLorePage from './components/LorePage/AddLorePage';
import Category from './components/Category/Category';
import LorePage from './components/LorePage/LorePage';
import ListPages from './components/Category/ListPages';
import World from './components/World';
// Temp until we get user page!
import {getList} from './actions/pageActions';
import {getCategoryList} from './actions/categoryActions';
import { getWorld,getWorldList } from './actions/worldActions';
import {useDispatch} from 'react-redux';
import { Container } from '@mui/material';
import CreateCategory from './components/Category/CreateCategory';
import CreateWorld from './components/CreateWorld';

// Main App component
function App() {
	
	// "Selects" data to be used from the state of the "store"
	const appState = useSelector((state) => {
		let error = state.lore.error;
		// If there is an error in the login, set that as app error
		if(state.category.error) {
			error = state.category.error;
		} else if(state.world.error) {
			error = state.world.error;
		} else if(state.login.error) {
			error = state.login.error;
		}
		// Returns only "isLogged", "error" and "loading" parts of state
		return {
			isLogged:state.login.isLogged,
			error:error,
			loading:state.login.loading,
			user :state.login.user,
			worldlist:state.world.list,
			worldurl: state.world.page.custom_url
		}
	})



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
	},[appState.isLogged,appState.worldlist,appState.user])

	//RENDERING
	
	// Set message to be shown on top of page
	let message = <></>
	if(appState.loading) {
		message = <h4>Loading...</h4>
	}
	if(appState.error) {
		message = <h4>{appState.error}</h4>
	}
	// If user is logged in, show Navbar, "message" and content
	// depending on the URL accessed. Routes are available paths.
	if(appState.isLogged&&appState.worldlist&&appState.worldlist.length>0) {
		return (
			<Container>
				<Navbar1/>
				<Navbar2 worldurl={appState.worldurl}/>
				<div style={{height:35,textAlign:"center"}}>
					{message}
				</div>
				<Routes>
					<Route path="/" element={<World/>}/>
					<Route path="/:worldurl" element={<ListPages />}/>
					<Route path="/new-category" element={<CreateCategory user={appState.user}/>}/>
					<Route path="/new-page" element={<AddLorePage user={appState.user}/>}/>
					<Route path="/:worldurl/category" element={<Category/>}/>
					<Route path="/:worldurl/category/:url" element={<Category/>}/>
					{/* <Route path="/category/*" element={<Category />}/> */}
					<Route path="/:worldurl/lorepage" element={<ListPages />}/>
					<Route path="/:worldurl/lorepage/:url" element={<LorePage/>}/>
					{/* <Route path={"/lorepage/"+id} element={<LorePage id={id}/>}/> */}
					{/* <Route path="/lorepage/*" element={<LorePage/>}/> */}
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</Container>
			// <div className="App" color='primary.dark'>
				
			// </div>
		);
		//OTHERWISE, IF THERE IS NO WORLDS YET, SHOW CREATE WORLD PAGE
	} else if (appState.isLogged&&appState.worldlist.length===0) {
		return (
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
			);
		} {
		// Otherwise show Navbar, "message" and LoginPage
		return (
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
			// <div className="App">
				
			// </div>
		);		
		
	}
}

export default App;

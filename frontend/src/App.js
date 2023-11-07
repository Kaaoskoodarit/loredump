import Navbar2 from './components/Navbar2';
import LoginPage from './components/LoginPage';
import {Route,Routes,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect } from 'react';
import AddLorePage from './components/LorePage/AddLorePage';
import Category from './components/Category/Category';
import LorePage from './components/LorePage/LorePage';
import ListPages from './components/Category/ListPages';
// Temp until we get user page!
import {getList} from './actions/pageActions';
import {getCategoryList} from './actions/categoryActions';
import { getWorldList } from './actions/worldActions';
import {useDispatch} from 'react-redux';

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
			worldlist:state.world.list
		}
	})
	
	const dispatch = useDispatch();

	useEffect(() => {
		console.log(appState.worldlist);
		if (appState.isLogged && appState.worldlist.length < 1) {
			dispatch(getWorldList());
		} else if (appState.isLogged && appState.worldlist) {
			if (appState.worldlist.length > 0) {
				console.log(appState.worldlist)
				const worldid = appState.worldlist[0].id;
				dispatch(getList(worldid));			
				dispatch(getCategoryList(worldid));
			} else {
				console.log("No worlds created yet!")
			}
		}
	},[appState.isLogged,appState.worldlist])

	//RENDERING
	
	// Set message to be shown on top of page
	let message = <></>
	if(appState.loading) {
		message = <h4>Loading...</h4>
	}
	if(appState.error) {
		message = <h4>{appState.error}</h4>
	}
	// If user is logged in, show Navbar, "message" and ShoppingList/ShoppingForm,
	// depending on the URL accessed. Routes are available paths.
	if(appState.isLogged) {
		return (
			<div className="App">
				<Navbar2 />
				<div style={{height:35,textAlign:"center"}}>
					{message}
				</div>
				<Routes>
					<Route path="/" element={<ListPages />}/>
					<Route path="/new-page" element={<AddLorePage user={appState.user}/>}/>
					<Route path="/category" element={<Category />}/>
					<Route path="/category/*" element={<Category />}/>
					<Route path="/lorepage" element={<ListPages />}/>
					<Route path="/lorepage/*" element={<LorePage />}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</div>
		);
	// Otherwise show Navbar, "message" and LoginPage
	} else {
		return (
			<div className="App">
				<Navbar2 />
				<div style={{height:35,textAlign:"center"}}>
					{message}
				</div>
				<Routes>
					<Route path="/" element={<LoginPage />}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</div>
		);		
		
	}
}

export default App;

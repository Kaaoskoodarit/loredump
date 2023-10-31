import Navbar2 from './components/Navbar2';
import LoginPage from './components/LoginPage';
import {Route,Routes,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import AddLorePage from './components/LorePage/AddLorePage';
import Category from './components/Category/Category';
import LorePage from './components/LorePage/LorePage';
import ListPages from './components/Category/ListPages';

// Main App component
function App() {
	
	// "Selects" data to be used from the state of the "store"
	const appState = useSelector((state) => {
		let error = state.page.error;
		// If there is an error in the login, set that as app error
		if(state.category.error) {
			error = state.category.error;
		} else if(state.login.error) {
			error = state.login.error;
		}
		// Returns only "isLogged", "error" and "loading" parts of state
		return {
			isLogged:state.login.isLogged,
			error:error,
			loading:state.login.loading,
			user :state.login.user
		}
	})
	
	
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

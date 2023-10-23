import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react';
import ShoppingForm from './components-old/ShoppingForm';
import Navbar2 from './components/Navbar2';
import LoginPage from './components-old/LoginPage';
import {Route,Routes,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import AddLorePage from './components/AddLorePage';
import Category from './components/Category';

function App() {
	
	const appState = useSelector((state) => {
		let error = state.page.error;
		// If there is an error in the login, set that as app error
		if(state.login.error) {
			error = state.login.error;
		}
		return {
			isLogged:state.login.isLogged,
			error:error,
			loading:state.login.loading,
			user :state.login.user
		}
	})
	
	
	//RENDERING
	
	let message = <></>
	if(appState.loading) {
		message = <h4>Loading...</h4>
	}
	if(appState.error) {
		message = <h4>{appState.error}</h4>
	}
	if(appState.isLogged) {
		return (
			<div className="App">
				<Navbar2 />
				<div style={{height:35,textAlign:"center"}}>
					{message}
				</div>
				<Routes>
					<Route path="/" element={<Category />}/>
					<Route path="/new-page" element={<AddLorePage user={appState.user}/>}/>
					<Route path="/form" element={<ShoppingForm />}/>
					<Route path="/api/lorepage" element={<Category />}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</div>
		);
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

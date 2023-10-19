import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react';
import ShoppingForm from './components/ShoppingForm';
import ShoppingList from './components/ShoppingList';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import {Route,Routes,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

function App() {
	
	const appState = useSelector((state) => {
		let error = state.shopping.error;
		if(state.login.error) {
			error = state.login.error;
		}
		return {
			isLogged:state.login.isLogged,
			error:error,
			loading:state.login.loading
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
				<Navbar />
				<div style={{height:35,textAlign:"center"}}>
					{message}
				</div>
				<Routes>
					<Route path="/" element={<ShoppingList />}/>
					<Route path="/form" element={<ShoppingForm />}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</div>
		);
	} else {
		return (
			<div className="App">
				<Navbar />
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

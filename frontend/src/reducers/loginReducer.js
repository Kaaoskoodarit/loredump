import * as actionConstants from '../actions/actionConstants';


// Check if we have a state stored in sessionStorage
const getInitialState = () => {
	if(sessionStorage.getItem("loginstate")) {
		// Parse a JSON string into a JS object
		let state = JSON.parse(sessionStorage.getItem("loginstate"));
		return state
	} else {
		return {
			isLogged:false,
			loading:false,
			error:"",
			username:"",
			user:"",
			theme:"Dark"
		}
	}
}

// Save to sessionStorage
const saveToStorage = (state) => {
	// JSON.stringify turn a JS object into JSON string
	sessionStorage.setItem("loginstate",JSON.stringify(state));
}

// Initialize state
const initialState = getInitialState();

// Reducer to handle login actions
// Reducer arguments are state and action
// Action always has a "type", optionally other properties
const loginReducer = (state = initialState,action) => {
	console.log("loginReducer, action",action);
	let tempState = {
		...state
	}
	// Switch-case to handle all possible login actions based on 
	// action.type
	switch(action.type) {
		case actionConstants.LOADING:
			return {
				...state,
				error:"",
				loading:true
			}
		case actionConstants.STOP_LOADING:
			return {
				...state,
				loading:false
			}
		case actionConstants.REGISTER_SUCCESS:
			tempState = {
				...state,
				error:"Register Success"
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGIN_SUCCESS:
			tempState = {
				...state,
				isLogged:true
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.SET_LOGIN:
			tempState = {
				...state,
				isLogged:true,
				user:action.user,
				username:action.username
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_SUCCESS:
			tempState = {
				isLogged:false,
				loading:false,
				error:"",
				username:"",
				user:"",
				theme:"Dark"
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.REGISTER_FAILED:
		case actionConstants.LOGIN_FAILED:
			tempState = {
				...state,
				error:action.error
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_FAILED:
			tempState = {
				isLogged:false,
				loading:false,
				error:action.error,
				username:"",
				user:"",
				theme:"Dark"
			}
			saveToStorage(tempState);
			return tempState;		
		case actionConstants.SET_USERNAME:
			tempState = {
				...state,
				user:action.user,
				username:action.username
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.SET_THEME:
			tempState = {
				...state,
				theme:action.theme
			}
			saveToStorage(tempState);
			return tempState;
		default:
			return state;
	}
}

export default loginReducer;
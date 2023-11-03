import * as actionConstants from '../actions/actionConstants';

// Check if we have a state stored in sessionStorage
const getInitialState = () => {
	if(sessionStorage.getItem("navigationstate")) {
		// Parse a JSON string into a JS object
		let state = JSON.parse(sessionStorage.getItem("navigationstate"));
		return state
	} else {
		return {
			navigating:false,
			url:"/",
			error:""
		}
	}
}

// Save to sessionStorage
const saveToStorage = (state) => {
	// JSON.stringify turn a JS object into JSON string
	sessionStorage.setItem("navigationstate",JSON.stringify(state));
}

// Initialize state
const initialState = getInitialState();

// Reducer to handle login actions
// Reducer arguments are state and action
// Action always has a "type", optionally other properties
const navigationReducer = (state = initialState,action) => {
	console.log("navigationReducer, action",action);
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
			}
		case actionConstants.NAVIGATING:
			tempState = {
				...state,
				navigating:true
			}
		case actionConstants.NAVIGATE_SUCCESS:
			tempState = {
				navigating:false,
                url:action.url,
                error:""
			}
            saveToStorage(tempState);
			return tempState;
		case actionConstants.NAVIGATE_FAILED:
			tempState = {
                ...state,
				navigating:false,
                error:action.error
			}
            saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_SUCCESS:
		case actionConstants.LOGOUT_FAILED:
			tempState = {
                navigating:false,
                url:"/",
                error:""
            }
			saveToStorage(tempState);
			return tempState;		
		default:
			return state;
	}
}

export default navigationReducer;
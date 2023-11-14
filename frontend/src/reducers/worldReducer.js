import * as actionConstants from '../actions/actionConstants';

// Check if we have a state stored in sessionStorage
const getInitialState = () => {
	if(sessionStorage.getItem("worldstate")) {
		let state = JSON.parse(sessionStorage.getItem("worldstate"));
		return state;
	} else {
		return {
			list:[],
			page:{},
			error:""
		}
	}
}

// Save to sessionStorage
const saveToStorage = (state) => {
	sessionStorage.setItem("worldstate",JSON.stringify(state));
}

// Initialize state
const initialState = getInitialState();

// Reducer to handle shopping actions
const worldReducer = (state = initialState,action) => {
	console.log("worldReducer,action",action);
	let tempState = {
		...state
	}
	switch(action.type) {
		case actionConstants.LOADING:
			return {
				...state,
				error:""
			}
		case actionConstants.FETCH_WORLDLIST_SUCCESS:
			tempState = {
				...state,
				list:action.list
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.FETCH_WORLD_SUCCESS:
			tempState = {
				...state,
				page:action.page
			}
			saveToStorage(tempState);
			return tempState;
        case actionConstants.REMOVE_WORLD_SUCCESS:
            tempState = {
				...state,
				page:{}
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.ADD_WORLD_SUCCESS:
		case actionConstants.EDIT_WORLD_SUCCESS:
			return state;
		case actionConstants.FETCH_WORLDLIST_FAILED:
		case actionConstants.FETCH_WORLD_FAILED:
		case actionConstants.ADD_WORLD_FAILED:
		case actionConstants.REMOVE_WORLD_FAILED:
		case actionConstants.EDIT_WORLD_FAILED:
			tempState = {
				...state,
				error:action.error
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_SUCCESS:
		case actionConstants.LOGOUT_FAILED:
			tempState = {
				list:[],
				page:{},
				error:""
			}
			saveToStorage(tempState);
			return tempState;
		default:
			return state;
	}
}

export default worldReducer;
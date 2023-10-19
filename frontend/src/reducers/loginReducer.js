import * as actionConstants from '../actions/actionConstants';

const getInitialState = () => {
	if(sessionStorage.getItem("loginstate")) {
		let state = JSON.parse(sessionStorage.getItem("loginstate"));
		return state
	} else {
		return {
			isLogged:false,
			loading:false,
			token:"",
			error:"",
			user:""
		}
	}
}

const saveToStorage = (state) => {
	sessionStorage.setItem("loginstate",JSON.stringify(state));
}

const initialState = getInitialState();

const loginReducer = (state = initialState,action) => {
	console.log("loginReducer, action",action);
	let tempState = {
		...state
	}
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
				token:action.token,
				isLogged:true
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_SUCCESS:
			tempState = {
				isLogged:false,
				loading:false,
				token:"",
				error:"",
				user:""
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
				token:"",
				error:action.error,
				user:""
			}
			saveToStorage(tempState);
			return tempState;		
		case actionConstants.SET_USERNAME:
			tempState = {
				...state,
				user:action.user
			}
			saveToStorage(tempState);
			return tempState;
		default:
			return state;
	}
}

export default loginReducer;
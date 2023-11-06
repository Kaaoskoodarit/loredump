import * as actionConstants from './actionConstants';
import {getList} from './pageActions';

//ASYNC THUNK

// (async) function that dispatches a register action to the reducer
export const register = (user) => {
	return async (dispatch) => {
		// Create request to be sent
		let request = {
			"method":"POST",
			"headers":{
				"Content-Type":"application/json"
			},
			"body":JSON.stringify(user)
		}
		// Dispatch a "loading" action to change store state
		dispatch(loading());
		// Try to perform a register requet on the server, wait for answer
		const response = await fetch("/register",request);
		// Once get an answer, stop loading
		dispatch(stopLoading());
		// If we get no response, error message
		if(!response) {
			dispatch(registerFailed("Register failed. Server never responded. Try again later"));
			return
		}
		// If response is ok (status 2XX), dispatch registerSuccess
		if(response.ok) {
			dispatch(registerSuccess());
		// Else, dispatch an error message
		} else {
			if(response.status === 409) {
				dispatch(registerFailed("Username already in use"))
			} else {
				dispatch(registerFailed("Register failed. Server responded with a status "+response.status+" "+response.statusText))
			}
		}
	}
}

// (async) function that dispatches a login action to the reducer
export const login = (user) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"Content-Type":"application/json"
			},
			"body":JSON.stringify(user)
		}
		dispatch(loading());
		const response = await fetch("/login",request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(loginFailed("Login failed. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// takes response, and turns it from JSON string to JS object
			// waits for parsing to be done!
			const data = await response.json();
			if(!data) {
				dispatch(loginFailed("Failed to parse login information. Try again later"))
				return;
			}
			// If data parsed, set current user, assign them a token, and 
			// display the user's shopping list
			dispatch(loginSuccess(data.token));
			dispatch(setUsername(user.username));
			dispatch(getList(data.token));
		} else {
			dispatch(loginFailed("Login failed. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a logout action to the reducer
export const logout = (token) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"token":token
			}
		}
		dispatch(loading());
		const response = await fetch("/logout",request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(logoutFailed("Server never responded. Logging you out"))
			return;
		}
		if(response.ok) {
			dispatch(logoutSuccess());
		} else {
			dispatch(logoutFailed("Server responded with an error. Logging you out"))
		}
	}
}

//ACTION CREATORS

// Simple functions that return an "action" object, with
// a "type" parameter, and optionally others as well, as needed
export const loading = () => {
	return {
		type:actionConstants.LOADING
	}
}

export const stopLoading = () => {
	return {
		type:actionConstants.STOP_LOADING
	}
}

const registerSuccess = () => {
	return {
		type:actionConstants.REGISTER_SUCCESS
	}
}

export const registerFailed = (error) => {
	return {
		type:actionConstants.REGISTER_FAILED,
		error:error
	}
}

const loginSuccess = (token) => {
	return {
		type:actionConstants.LOGIN_SUCCESS,
		token:token
	}
}

const loginFailed = (error) => {
	return {
		type:actionConstants.LOGIN_FAILED,
		error:error
	}
}

const logoutSuccess = () => {
	return {
		type:actionConstants.LOGOUT_SUCCESS
	}
}

export const logoutFailed = (error) => {
	return {
		type:actionConstants.LOGOUT_FAILED,
		error:error
	}
}

const setUsername = (user) => {
	return {
		type:actionConstants.SET_USERNAME,
		user:user
	}
}
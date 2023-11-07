import * as actionConstants from './actionConstants';
import { useNavigate } from 'react-router-dom';
import {loading,stopLoading,logoutFailed} from './loginActions';
import {getList} from './pageActions';
import {getCategoryList} from '../actions/categoryActions';

//ASYNC THUNK

// (async) function that dispatches a navigate action to the reducer
export const navigator = (url) => {
	return async (dispatch) => {
        const navigate = useNavigate()
		// Dispatch a "loading" action to change store state
		dispatch(navigating());
		// Do something to navigate to a page: navigate? redirect?
        
        navigate(url)
		// If we get no response, error message
		if(!response) {
			dispatch(navigateFailed("Navigate failed. Server never responded. Try again later"));
			return
		}
		// If response is ok (status 2XX), dispatch registerSuccess
		if(response.ok) {
			dispatch(navigateSuccess(url));
		// Else, dispatch an error message
		} else {
			dispatch(navigateFailed("Navigate failed. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}


//ACTION CREATORS

// Simple functions that return an "action" object, with
// a "type" parameter, and optionally others as well, as needed

export const navigating = () => {
	return {
		type:actionConstants.NAVIGATING
	}
}

export const navigateSuccess = (url) => {
	return {
		type:actionConstants.NAVIGATE_FAILED,
		url:url
	}
}
export const navigateFailed = (error) => {
	return {
		type:actionConstants.NAVIGATE_FAILED,
		error:error
	}
}

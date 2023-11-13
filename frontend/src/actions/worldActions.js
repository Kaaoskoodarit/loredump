import {loading,stopLoading,logoutFailed} from './loginActions';
import * as actionConstants from './actionConstants';

//ASYNC THUNKS

// (async) function that dispatches a getWorldList action to the reducer
// This displays the list of pages
export const getWorldList = () => {
	return async (dispatch) => {
		// Set request
		let request = {
			"method":"GET"
		}
		// Start loading
		dispatch(loading());
		// Try to fetch the world list from the server, wait for response
		const response = await fetch("/api/worlds",request);
		// Stop loading
		dispatch(stopLoading());
		// If no response, error
		if(!response) {
			dispatch(fetchWorldListFailed("Failed to fetch world information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// Try to parse response from JSON, wait for result
			const list = await response.json();
			// If no list, error
			if(!list) {
				dispatch(fetchWorldListFailed("Failed to parse world information. Try again later."))
				return;
			}
			// If list found, show it!
			dispatch(fetchWorldListSuccess(list));
		// If response not ok, error
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			} else if (response.status === 404) {
				console.log("Failed to fetch world information. No worlds exist!?");
				return;
			}
			dispatch(fetchWorldListFailed("Failed to fetch world information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a getWorld action to the reducer
export const getWorld = (id) => {
	return async (dispatch) => {
		// Set request
		let request = {
			"method":"GET"
		}
		// Start loading
		dispatch(loading());
		// Try to fetch the world from the server, wait for response
		const response = await fetch("/api/worlds/"+id,request);
		// Stop loading
		dispatch(stopLoading());
		// If no response, error
		if(!response) {
			dispatch(fetchWorldFailed(actionConstants.FETCH_WORLD_FAILED,"Failed to fetch world information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// Try to parse response from JSON, wait for result
			const world = await response.json();
			// If no page, error
			if(!world) {
				dispatch(fetchWorldFailed(actionConstants.FETCH_WORLD_FAILED,"Failed to parse world information. Try again later."))
				return;
			}
			// If page found, show it!
			dispatch(fetchWorldSuccess(actionConstants.FETCH_WORLD_SUCCESS,world));
		// If response not ok, error
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchWorldFailed(actionConstants.FETCH_WORLD_FAILED,"Failed to fetch world information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "add world" action to the reducer
export const addWorld = (world) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"Content-type":"application/json",
			},
			"body":JSON.stringify(world)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds",request);
		dispatch(stopLoading()); 
		if(!response) {
			dispatch(fetchWorldFailed(actionConstants.ADD_WORLD_FAILED,"Failed to add new world. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch successful, show new list!
			dispatch(fetchWorldSuccess(actionConstants.ADD_WORLD_SUCCESS));
			// Get updated list
			dispatch(getWorldList());
			// Get new world
			const newworld = await response.json();
			dispatch(getWorld(newworld.id));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchWorldFailed(actionConstants.ADD_WORLD_FAILED,"Failed to add new world. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "remove world" action to the reducer
export const removeWorld = (id) => {
	return async (dispatch) => {
		let request = {
			"method":"DELETE"
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/"+id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchWorldFailed(actionConstants.REMOVE_WORLD_FAILED,"Failed to remove world. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list!
			dispatch(fetchWorldSuccess(actionConstants.REMOVE_WORLD_SUCCESS));
			// Get updated list
			dispatch(getWorldList());
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchWorldFailed(actionConstants.REMOVE_WORLD_FAILED,"Failed to remove world. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "edit world" action to the reducer
export const editWorld = (world) => {
	return async (dispatch) => {
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json"
			},
			"body":JSON.stringify(world)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/"+world.id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchWorldFailed(actionConstants.EDIT_WORLD_FAILED,"Failed to edit world. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchWorldSuccess(actionConstants.EDIT_WORLD_SUCCESS));
			dispatch(getWorldList());
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchWorldFailed(actionConstants.EDIT_WORLD_FAILED,"Failed to edit world. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "update world" action to the reducer
export const updateWorld = (id,update) => {
	return async (dispatch) => {
		let tempbody = {"update":update}
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json",
			},
			"body":	JSON.stringify(tempbody)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/update/"+id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchWorldFailed(actionConstants.EDIT_WORLD_FAILED,"Failed to edit world. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchWorldSuccess(actionConstants.EDIT_WORLD_SUCCESS));
			dispatch(getWorldList());
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchWorldFailed(actionConstants.EDIT_WORLD_FAILED,"Failed to edit world. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

//ACTION CREATORS

// Simple functions that return an "action" object, with
// a "type" parameter, and optionally others as well, as needed
export const fetchWorldListSuccess = (list) => {
	return {
		type:actionConstants.FETCH_WORLDLIST_SUCCESS,
		list:list
	}
}

export const fetchWorldListFailed = (error) => {
	return {
		type:actionConstants.FETCH_WORLDLIST_FAILED,
		error:error
	}
}

export const fetchWorldSuccess = (type,page) => {
	return {
		type:type,
		page:page
	}
}

export const fetchWorldFailed = (type,error) => {
	return {
		type:type,
		error:error
	}
}
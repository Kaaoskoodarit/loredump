import {loading,stopLoading,logoutFailed} from './loginActions';
import * as actionConstants from './actionConstants';

//ASYNC THUNKS

export const getList = (token) => {
	return async (dispatch) => {
		let request = {
			"method":"GET",
			"headers":{
				"token":token
			}
		}
		dispatch(loading());
		const response = await fetch("/api/shopping",request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchListFailed("Failed to fetch shopping information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			const list = await response.json();
			if(!list) {
				dispatch(fetchListFailed("Failed to parse shopping information. Try again later."))
				return;
			}
			dispatch(fetchListSuccess(list));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchListFailed("Failed to fetch shopping information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

export const add = (token,item) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"Content-type":"application/json",
				"token":token
			},
			"body":JSON.stringify(item)
		}
		dispatch(loading());
		const response = await fetch("/api/shopping",request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchItemFailed(actionConstants.ADD_ITEM_FAILED,"Failed to add new item. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			dispatch(fetchItemSuccess(actionConstants.ADD_ITEM_SUCCESS));
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchItemFailed(actionConstants.ADD_ITEM_FAILED,"Failed to add new item. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

export const remove = (token,id) => {
	return async (dispatch) => {
		let request = {
			"method":"DELETE",
			"headers":{
				"token":token
			}
		}
		dispatch(loading());
		const response = await fetch("/api/shopping/"+id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchItemFailed(actionConstants.REMOVE_ITEM_FAILED,"Failed to remove item. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			dispatch(fetchItemSuccess(actionConstants.REMOVE_ITEM_SUCCESS));
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchItemFailed(actionConstants.REMOVE_ITEM_FAILED,"Failed to remove item. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

export const edit = (token,item) => {
	return async (dispatch) => {
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json",
				"token":token
			},
			"body":JSON.stringify(item)
		}
		dispatch(loading());
		const response = await fetch("/api/shopping/"+item.id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchItemFailed(actionConstants.EDIT_ITEM_FAILED,"Failed to edit item. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			dispatch(fetchItemSuccess(actionConstants.EDIT_ITEM_SUCCESS));
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchItemFailed(actionConstants.EDIT_ITEM_FAILED,"Failed to edit item. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

//ACTION CREATORS

const fetchListSuccess = (list) => {
	return {
		type:actionConstants.FETCH_LIST_SUCCESS,
		list:list
	}
}

const fetchListFailed = (error) => {
	return {
		type:actionConstants.FETCH_LIST_FAILED,
		error:error
	}
}

const fetchItemSuccess = (type) => {
	return {
		type:type
	}
}

const fetchItemFailed = (type,error) => {
	return {
		type:type,
		error:error
	}
}
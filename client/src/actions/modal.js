import { OPEN_MODAL,CLOSE_MODAL } from '../constants';

export const openModal = media => {
    return dispatch => {
        dispatch({
            type: OPEN_MODAL,
            media
        })
    }
}

export const closeModal = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL
        })
    }
}
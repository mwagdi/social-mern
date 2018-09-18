import { OPEN_MODAL,CLOSE_MODAL } from '../constants';

const initialState = {
    modalIsOpen: false,
    media: []
}

export const modalReducer = (state=initialState,action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return {
                modalIsOpen: true,
                media: action.media
            };
        case CLOSE_MODAL:
            return {
                modalIsOpen: false,
                media: []
            };
        default:
            return state;
    }
}
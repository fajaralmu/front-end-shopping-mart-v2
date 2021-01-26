import * as types from './types'
import Services from './../services/Services';

export const initState = { 
    entities: [],
    entity: {},  
    requestId: null,
    messages: null,
    userAlias: "anonymous_" + new Date().getTime(),
    cart: [], 
    services: new Services(),
    mainApp: undefined

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
         
        case types.SET_MAIN_APP:
            return {...state, mainApp: action.payload};
        case types.REMOVE_SHOP_ENTITY:
            return { ...state, entity: action.payload  /*null*/ }; 
        // case types.REQUEST_ID:

        //     return { ...state, requestId: action.payload.message };
        // case types.SEND_MESSAGE:
        //     return { ...state, messages: action.payload.entities, userAlias: action.payload.username };
        case types.STORE_MESSAGE:
            return { ...state, messages: action.payload.entities };
        case types.GET_MESSAGE:
            return { ...state, messages: action.payload.entities };
        case types.UPDATE_CART:
            return { ...state, cart: action.payload.cart };

       
        default:
            return state;
    }
}

export default reducer;
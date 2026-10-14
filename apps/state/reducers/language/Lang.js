const initialState = {
    loading: false,
    language: 'id',
    error: null
};

const Lang = (state = initialState, action) => {
    switch (action.type) {
        case 'LANG.ADD_DATA':
            return {
                ...state,
                language: action.data,
                loading: false,
                error: null,
            };
            break;
        case 'LANG.FETCH':
            return {
                ...state,
                loading: true
            }
            break;
        case 'LANG.CLEAR':
            return initialState;
            break;
        default:
            return state;
    }
};

export default Lang;

const initialState = {
    loading: false,
    dataStarted: null,
    error: null
};

const Started = (state = initialState, action) => {
    switch (action.type) {
        case 'STARTED.ADD_DATA':
            return {
                ...state,
                dataStarted: action.data,
                loading: false,
                error: null,
            };
            break;
        case 'STARTED.FETCH':
            return {
                ...state,
                loading: true
            }
            break;
        case 'STARTED.CLEAR':
            return initialState;
            break;
        default:
            return state;
    }
};

export default Started;

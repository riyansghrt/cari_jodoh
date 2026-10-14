import { createStore, applyMiddleware } from 'redux';
import { persistStore} from 'redux-persist';
import thunk from 'redux-thunk';

import reducer from '../reducers';

export let store = createStore(
    reducer,
    applyMiddleware(thunk)
);

export let persistor = persistStore(store);

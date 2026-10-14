import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCombineReducers } from 'redux-persist';

import Auth from '../reducers/user/Auth';
import Started from '../reducers/order/Started';
import Lang from '../reducers/language/Lang';
const config = {
    key: 'root',
    storage: AsyncStorage,
    timeout: null,
};

const reducer = persistCombineReducers(config, {
    'user': Auth,
    'started': Started,
    'language': Lang,
});

export default reducer;

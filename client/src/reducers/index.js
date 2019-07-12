import { combineReducers } from 'redux';
import contactList from './contactList';

const contactListApp = combineReducers({
    contactList,
});

export default contactListApp;
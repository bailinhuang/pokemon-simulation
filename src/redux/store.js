import { createStore } from 'redux';  
import {reducer} from 'reducer.js'
let store = createStore(reducer , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
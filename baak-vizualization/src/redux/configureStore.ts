import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,

  Store,
} from 'redux'
import createSagaMiddleware from 'redux-saga'

import { saga } from 'ducks/root'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
  }
}

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const createStoreWithMiddleware = composeEnhancers(
  applyMiddleware(sagaMiddleware),
)(createStore)

const reducers = combineReducers({})

const configureStore = (initialState?: any): Store<any> => {
  const store: Store<any> = createStoreWithMiddleware(reducers, initialState)

  return store
}

// run redux-saga
sagaMiddleware.run(saga)

export default configureStore

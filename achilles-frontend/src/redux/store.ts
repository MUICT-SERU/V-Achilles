import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";

import allSaga from "./all-saga";
import allReducer from "./all-reducer";

const sageMiddleware = createSagaMiddleware();

const store = createStore(allReducer, applyMiddleware(sageMiddleware));

sageMiddleware.run(allSaga);

export { store };

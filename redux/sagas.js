import {all} from "redux-saga/effects";
import { productsWatcherSaga } from "./products/productSaga";
import { collectionWatcherSaga } from "./collections/collectionSaga";

export default function* rootSaga(){
    yield all([
        productsWatcherSaga(),
        collectionWatcherSaga(),
    ])

}
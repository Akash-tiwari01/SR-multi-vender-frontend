import {all} from "redux-saga/effects";
import { productsWatcherSaga } from "./products/productSaga";
import { collectionWatcherSaga } from "./collections/collectionSaga";
import userRootSaga,{userWatcher} from '@/modules/user/sagas/userSaga'
export default function* rootSaga(){
    yield all([
        // userRootSaga(),
        userWatcher(),
        productsWatcherSaga(),
        collectionWatcherSaga(),
    ])

}
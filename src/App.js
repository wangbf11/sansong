import React from "react"
import storeFun from "./store"
import { Provider } from "react-redux"
import Route from "./routes"
import {AsyncStorage} from 'react-native'

import Storage from 'react-native-storage'

global.store = storeFun()

var storage = new Storage({
    size: 1000*1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})
// 全局变量
global.storage = storage

export default function() {
    return (
        <Provider store={store}>
            <Route />
        </Provider>
    )
}

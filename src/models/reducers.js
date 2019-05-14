import { combineReducers } from "redux"
import { userInfo ,listData} from "./user/reducer"
export default combineReducers({
    userInfo,
    listData
})

import { LOGIN, GET_LIST_DATA, DEVICE_INFO } from "./types"
import { handleActions } from "redux-actions"

const defaultState = null

export const userInfo = handleActions(
    {
        [LOGIN]: (state, { payload }) => {
            return { ...state, ...payload }
        }
    },
    defaultState
)
export const listData = handleActions(
    {
        [GET_LIST_DATA]: (state, { payload }) => {
            return { ...state, ...payload }
        }
    }, defaultState
)

export const deviceInfo  = handleActions(
    {
        [DEVICE_INFO]: (state, { payload }) => {
            return { ...state, ...payload }
        }
    }, defaultState
)

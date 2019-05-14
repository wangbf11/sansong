import { connect } from 'react-redux'

import Login from './container/index'

import actions from '../../../models/actions'

export default connect(
    ({ userInfo }) => ({
        userInfo
    }), {
        getUserMessgaeCode: actions.getUserMessgaeCode,
        getLoginToken: actions.getLoginToken
    }
)(Login)
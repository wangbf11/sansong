import { connect } from 'react-redux'

import BindPhone from './container/index'

import actions from '../../../models/actions'

export default connect(
    ({ userInfo }) => ({
        userInfo
    }), {
        getUserMessgaeCode: actions.getUserMessgaeCode,
    }
)(BindPhone)
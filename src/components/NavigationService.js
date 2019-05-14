// NavigationService.js

import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function reset(routeName, params) {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName,
                    params,
                })
            ],
        })
    );
}

function getState() {
    if (!_navigator || !_navigator.state) {
        return null
    }
    return _navigator.state
}

export default {
    getState,
    reset,
    navigate,
    setTopLevelNavigator,
};

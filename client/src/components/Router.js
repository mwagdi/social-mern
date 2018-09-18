import React, { Component } from 'react';
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';
import { connect } from 'react-redux';

import Dashboard from '../routes/Dashboard';
import Login from '../routes/Login';
import Register from '../routes/Register';

import Topbar from './Topbar';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//     return(
//     <Route
//         {...rest}
//         render={props =>
//             props.authenticated ? (
//                 <Component {...props} />
//             ) : (
//                     <Redirect
//                         to={{
//                             pathname: "/login",
//                         }}
//                     />
//                 )
//         }
//     />
// )};

class Router extends Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <div>
                        {this.props.user.authenticated &&
                            <Topbar user={this.props.user} />}
                        <Route exact path="/" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/dashboard" component={Dashboard} />
                        {/* <PrivateRoute path="/" component={Dashboard} /> */}
                    </div>
                </Switch>
            </BrowserRouter>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps,{})(Router);
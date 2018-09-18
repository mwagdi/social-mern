import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect,Link } from "react-router-dom";
import axios from 'axios';

import { login,autLogin } from "../actions";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: localStorage.getItem('remember') ? localStorage.getItem('email') : "",
            password: localStorage.getItem('remember') ? localStorage.getItem('password') : "",
            submitted: false,
            remember: localStorage.getItem('remember') ? true : false
        }
        this.submitForm = this.submitForm.bind(this);
    }
    componentDidMount(){
        const token = localStorage.getItem('token');
        if(token){
            const expiryTime = localStorage.getItem('expiry_time');
            if(expiryTime > Date.now()){
                this.props.autLogin();
            }
        }
    }
    setRemember(){
        this.setState({ remember: !this.state.remember },() => {
            if(this.state.remember){
                localStorage.setItem('remember', 'set');
            }
            else{
                localStorage.removeItem('remember');
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }
        })
    }
    submitForm(e){
        e.preventDefault();
        this.props.login(this.state.email,this.state.password);
    }
    render() {
        if(this.props.user.authenticated){
            return <Redirect to="/dashboard" />
        }
        return (
            <div className="login">
                <div className="login__wrap">
                    <h1>Login</h1>
                    <form className="login__form" onSubmit={this.submitForm}>
                        <input
                        onChange={e => this.setState({ email: e.target.value })}
                        type="email"
                        value={this.state.email}
                        placeholder="Email"/>
                        <input
                        onChange={e => this.setState({ password: e.target.value })}
                        type="password"
                        value={this.state.password}
                        placeholder="Password"/>
                        <div onClick={() => this.setRemember()} className="custom-checkbox flex-container v-center">
                            <div className={`custom-checkbox__box ${this.state.remember ? 'checked' : ''}`}>
                                {this.state.remember &&
                                    <i className="icon-ok"></i>}
                            </div>
                            <p className="custom-checkbox__label">Remember Me</p>
                        </div>
                        <input className="btn btn--fullWidth" type="submit" value="Login"/>
                    </form>
                    <Link className="register-link" to="/register">Sign up</Link>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps,{ login,autLogin })(Login);

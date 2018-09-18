import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import axios from 'axios';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirm_password: "",
            submitted: false,
            avatar: null
        }
        this.submitForm = this.submitForm.bind(this);
    }
    
    submitForm(e){
        e.preventDefault();
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.confirm_password,
        }
        let formData = new FormData();

        for (var key in data) {
            formData.append(key,data[key]);
        }
        formData.append('avatar', this.state.avatar, `${Date.now()}profile`)
        axios({
            method: 'post',
            url: 'api/users/register',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
        .then(response => {
            this.setState({submitted: true});
        })
    }
    render() {
        if(this.props.user.authenticated){
            return <Redirect to="/dashboard" />
        }
        if(this.state.submitted){
            return <Redirect to="/" />
        }
        return (
            <div className="login">
                <div className="login__wrap register">
                    <h1>Register</h1>
                    <form className="login__form" onSubmit={this.submitForm}>
                        <input
                            onChange={e => this.setState({ name: e.target.value })}
                            type="text"
                            value={this.state.name}
                            placeholder="Name" />
                        <button
                        className="btn btn--dark"
                            onClick={(e) => { e.preventDefault(); document.getElementById('avatar').click() }}>Upload Avatar</button>
                        <input
                        type="file"
                        className="hide"
                        name="avatar"
                        id="avatar"
                            onChange={e => this.setState({ avatar: Array.from(e.target.files)[0]})}/>
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
                        <input
                        onChange={e => this.setState({ confirm_password: e.target.value })}
                        type="password"
                        value={this.state.confirm_password}
                        placeholder="Password"/>
                        <input className="btn btn--fullWidth" type="submit" value="Register"/>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps,{})(Register);

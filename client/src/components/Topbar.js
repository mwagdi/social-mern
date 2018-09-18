import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { logout } from '../actions';

import logo from '../assets/images/social_logo.png';

class Topbar extends Component{
    constructor(props){
        super(props);
        this.state = {
            users: []
        }
    }
    searchUsers(str){
        if(str === ""){
            this.setState({users: []});
        }
        else{
            axios.get(`api/users?search=${str}`)
                .then(response => this.setState({ users: response.data.users }));
        }
    }
    render(){
        const { name,avatar,profile } = this.props.user;
        return (
            <div className="topbar">
                <div className="row flex-container v-center space-between">
                    <div className="topbar__left flex-container v-center">
                        <Link className="topbar__logo" to="/dashboard">
                            <img src={logo} alt="social logo"/>
                        </Link>
                        <div className="topbar__search">
                            <input placeholder="Search for users..." onChange={e => this.searchUsers(e.target.value)} type="text" id="topbarsearch" />
                            {this.state.users.length > 0 &&
                                <ul className="topbar__search_list">
                                {this.state.users.map((user, i) => <li className="topbar__search_item flex-container v-center" key={i}><Link to="">{user.name}</Link></li>)}   
                                </ul>}
                        </div>
                    </div>
                    <div className="topbar__right flex-container v-center">
                        <div className="topbar__notifications">
                            <a className="topbar__notifications_btn">
                                <i className="icon-bell"></i>
                            </a>
                            <ul className="topbar__notifications_list"></ul>
                        </div>
                        <Link className="topbar__profile flex-container v-center" to={`/profile/${profile}`}>
                            <div
                            className="topbar__avatar"
                            style={{backgroundImage: `url(${avatar})`}}></div>
                            <span>{name}</span>
                        </Link>
                        <a className="topbar__logout" onClick={() => this.props.logout()}>Logout</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null,{ logout })(Topbar);
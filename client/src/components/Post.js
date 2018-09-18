import React,{ Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { openModal } from '../actions';

class Post extends Component{
    constructor(props){
        super(props);
        
    }
    render(){
        const {user,
            text,
            media,
            profile,
            likes,
            comments,
            date} = this.props.post;
        return (
            <div className="post flex-container">
                <div className="grow">
                    <div className="post__header flex-container v-center">
                        <div
                        className="post__avatar"
                        style={{backgroundImage: `url(${user.avatar})`}}></div>
                        <h3 className="post__name">{user.name}</h3>
                    </div>
                    <div className="post__content">
                        {text}
                    </div>
                </div>
                {media && media.length > 0 &&
                    <div
                    className="post__media"
                    onClick={() => this.props.openModal(media)}>
                        <img src={`http://localhost:5000/${media[0]}`} className="post__thumb"/>
                        {media.length > 1 &&
                        <div className="post__media_overlay flex-container flex-column v-center justify-center">
                           <h3>{media.length}</h3>
                           <h3>Images</h3> 
                        </div>}
                    </div>}
            </div>
        )
    }
}

export default connect(null,{ openModal })(Post);
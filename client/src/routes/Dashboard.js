import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

import { closeModal } from '../actions';

import Post from '../components/Post';
import ImageSlider from '../components/ImageSlider';

const modalStyles = {
    content:{
        position: 'absolute',
        maxWidth: '700px',
        margin: 'auto',
        top: '80px',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 0,
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        display: 'flex',
        alignItems: 'center'
    },
    overlay:{
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
}

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            text: "",
            files: [],
        }
        this.addFile = this.addFile.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    componentDidMount() {
        axios.get('api/posts/1')
        .then(response => {
            this.setState({posts: response.data});
        })
    }
    addFile(e){
        if(e.target.files.length){
            this.setState({
                files: [
                    ...this.state.files,
                    ...Array.from(e.target.files)
                ]
            })
        }
    }
    closeModal() {
        this.props.closeModal();
    }
    submitForm(e){
        e.preventDefault();
        let that = this;
        if(this.state.text.length || this.state.files.length){
            let formData = new FormData();

            formData.append('text', this.state.text);
            this.state.files.forEach((file, i) => {
                formData.append('media', file, `${this.props.user.id}${Date.now()}${i}`)
            });


            axios({
                method: 'post',
                url: 'api/posts',
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(function (response) {
                    that.setState({
                        posts: [
                            {
                                ...response.data,
                                user: that.props.user
                            },
                            ...that.state.posts
                        ],
                        text: "",
                        files: []
                    })
                })
                .catch(function (response) {
                    console.log(response);
                });
        }
    }
    render(){
        if(!this.props.user.authenticated){
            return <Redirect to="/" />
        }
        const { media,modalIsOpen } = this.props;
        return (
            <div className="main dashboard">
                <div className="row">
                    <form id="postForm" className="post-form flex-container flex-column" onSubmit={this.submitForm}>
                        <div className="post-form__header">
                            <button
                            className="btn btn--dark"
                            onClick={ (e) => {e.preventDefault();document.getElementById('im').click()} }
                            >Share Image(s)</button>
                            {this.state.files.length > 0 && <span>Images: {this.state.files.length}</span>}
                        </div>
                        <textarea
                        onChange={e => this.setState({ text: e.target.value })}
                        placeholder="Share Something..."></textarea>
                        <input
                        className="hide"
                        type="file"
                        name="media"
                        id="im"
                        onChange={this.addFile}
                        multiple />
                        <div className="post-form__footer">
                            <input
                            className={`btn btn--dark ${this.state.text.length === 0 && this.state.files.length === 0 ? 'btn--disabled' : ''}`} type="submit"
                            value="Post"
                            />
                        </div>
                        
                    </form>
                    {this.state.posts.map((post, i) => <Post key={i} post={post} />)}
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyles}
                >
                    {media && media.length > 0 &&
                        <ImageSlider media={media} />}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        modalIsOpen: state.modal.modalIsOpen,
        media: state.modal.media
    }
}

export default connect(mapStateToProps,{ closeModal })(Dashboard);

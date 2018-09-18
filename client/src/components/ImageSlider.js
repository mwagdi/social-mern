import React,{ Component } from 'react';

class ImageSlider extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentIndex: 0,
            lastIndex: this.props.media.length - 1
        }
    }
    componentWillMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }
    onKeyPressed(e) {
        const { media } = this.props;
        if(e.keyCode === 37 && media.length > 1){
            this.changeSlide('prev');
        }
        if(e.keyCode === 39 && media.length > 1){
            this.changeSlide('next');
        }
    }

    changeSlide(dir){
        if(dir === 'previous'){
            if(this.state.currentIndex === 0){
                this.setState({currentIndex: this.state.lastIndex});
            }
            else{
                this.setState({currentIndex: this.state.currentIndex - 1})
            }
        }
        else{
            if(this.state.currentIndex === this.state.lastIndex){
                this.setState({currentIndex: 0})
            }
            else{
                this.setState({currentIndex: this.state.currentIndex + 1});
            }
        }
    }
    render(){
        const { media } = this.props;
        return (
            <div className="slider" onKeyDown={this.onKeyPressed}>
                {media && media.length > 0 &&
                    <img src={`http://localhost:5000/${media[this.state.currentIndex]}`} alt="slide image" className="slider__slide" />}
                {media && media.length > 1 &&
                    <a
                    className="slider__nav slider__nav--prev"
                    onClick={() => this.changeSlide('previous')}>
                        <i className="icon-left"></i>
                    </a>}
                {media && media.length > 1 &&
                    <a
                    className="slider__nav slider__nav--next"
                    onClick={() => this.changeSlide('next')}>
                        <i className="icon-right"></i>
                    </a>}
            </div>
        )
    }
}

export default ImageSlider;
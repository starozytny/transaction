import React, { Component } from 'react';

export class Aside extends Component {
    constructor (props) {
        super(props)

        this.state = {
            title: null,
            active: false,
            content: props.content ? props.content : null
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChangeContent = this.handleChangeContent.bind(this)
    }

    handleOpen = (title) => { this.setState({ active: true, title: title }) }
    handleClose = () => { this.setState({ active: false }) }
    handleChangeContent = (content) => { this.setState({ content }) }

    render () {
        const { children } = this.props
        const { content, active, title } = this.state

        return <div className={`aside ${active}`}>
            <div className="aside-overlay" onClick={this.handleClose} />
            <div className="aside-content">
                <div className="aside-title">
                    <span className="title">{title ? title : children}</span>
                    <span className="icon-cancel" onClick={this.handleClose} />
                </div>
                {content}
            </div>
        </div>
    }
}
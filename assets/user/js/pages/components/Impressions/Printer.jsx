import React, { Component } from "react";

export class Printer extends Component{
    constructor(props) {
        super(props);

        this.state = {
            elem: props.donnees ? JSON.parse(props.donnees) : null
        }
    }
    componentDidMount() {
        // window.print()
    }

    render () {
        const { content } = this.props;

        return <>{content}</>
    }
}
import React, { Component } from "react";

export class Printer extends Component{
    componentDidMount() {
        window.print()
    }

    render () {
        const { content } = this.props;

        return <>{content}</>
    }
}
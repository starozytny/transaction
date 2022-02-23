import React, { Component } from "react";

export class PrintOwner extends Component{
    componentDidMount() {
        window.print()
    }

    render () {
        return <div className="txt-danger">
            Hello there
        </div>
    }
}
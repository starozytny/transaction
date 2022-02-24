import React, { Component } from "react";

import { ReadCard } from "@userComponents/Layout/Read";

export class PrintOwner extends Component{
    constructor(props) {
        super(props);

        this.state = {
            elem: props.donnees ? JSON.parse(props.donnees) : null
        }
    }
    componentDidMount() {
        window.print()
    }

    render () {
        const { elem } = this.state;

        return <div>
            <ReadCard elem={elem} />
            <ReadCard elem={elem} />
            <ReadCard elem={elem} />
            <ReadCard elem={elem} />
            <ReadCard elem={elem} />
        </div>
    }
}
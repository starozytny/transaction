import React, { Component } from "react";

import { Printer } from "@userPages/components/Impressions/Printer";

export class PrintBien extends Component{
    render () {
        const { donnees } = this.props;

        let content = <>
            Hello
        </>

        return <>
            <Printer donnees={donnees} content={content} />
        </>
    }
}
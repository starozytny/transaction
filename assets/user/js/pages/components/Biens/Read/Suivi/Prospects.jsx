import React, {Component} from "react";

import { ProspectsList } from "@dashboardPages/components/Immo/Prospects/ProspectsList";

export class Prospects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list"
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { data } = this.props;
        const { context } = this.state;

        let content;
        switch (context) {
            case "create":
                content = "create";
                break
            default:
                content = <ProspectsList isFromRead={true} isClient={true} data={data} onChangeContext={this.handleChangeContext}/>
                break;
        }

        return (<div className="details-tab-infos">
            {content}
        </div>)
    }

}
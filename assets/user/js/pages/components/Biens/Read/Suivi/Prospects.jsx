import React, {Component} from "react";

import { ProspectsList } from "@dashboardPages/components/Immo/Prospects/ProspectsList";
import { Aside }         from "@dashboardComponents/Tools/Aside";

export class Prospects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list"
        }

        this.aside = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => {
        if(context === "select"){
            this.aside.current.handleOpen("Sélectionner un existant");
        }
        this.setState({ context })
    }

    render () {
        const { data } = this.props;
        const { context } = this.state;

        let content;
        switch (context) {
            case "create":
                content = "create";
                break
            default:
                content = <ProspectsList isFromRead={true} isClient={true} data={data}
                                         onChangeContext={this.handleChangeContext} />
                break;
        }

        let contentAside = <ProspectsList isSelect={true} isFromRead={true} isClient={true} data={data} />

        return (<div className="details-tab-infos details-prospects">
            {content}

            <Aside ref={this.aside} content={contentAside}/>
        </div>)
    }

}
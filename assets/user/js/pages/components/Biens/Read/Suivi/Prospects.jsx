import React, {Component} from "react";

import { ProspectsList } from "@dashboardPages/components/Immo/Prospects/ProspectsList";
import { Aside }         from "@dashboardComponents/Tools/Aside";

import helper       from "@userPages/components/Biens/helper";
import DataState    from "@userPages/components/Biens/Form/data";

export class Prospects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            data: props.data,
            allProspects: []
        }

        this.aside = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleSelectProspect = this.handleSelectProspect.bind(this);
    }

    componentDidMount() {
        DataState.getProspects(this);
    }

    handleChangeContext = (context) => {
        if(context === "select"){
            this.aside.current.handleOpen("Sélectionner un existant");
        }
        this.setState({ context })
    }

    handleSelectProspect = (prospect) => {
        const { data } = this.state;

        let nData = helper.addOrRemove(data, prospect, "Prospect ajouté.", "Prospect enlevé.");
        this.setState({ data: nData });
    }

    render () {
        const { context, data, allProspects } = this.state;

        let content;
        switch (context) {
            case "create":
                content = "create";
                break
            default:
                content = <ProspectsList isFromRead={true} isClient={true} data={data}
                                         onChangeContext={this.handleChangeContext}
                                         onSelectProspect={this.handleSelectProspect} />
                break;
        }

        let contentAside = <ProspectsList isSelect={true} isFromRead={true} isClient={true} data={allProspects} prospects={data}
                                          onSelectProspect={this.handleSelectProspect} />

        return (<div className="details-tab-infos details-prospects">
            {content}

            <Aside ref={this.aside} content={contentAside}/>
        </div>)
    }

}
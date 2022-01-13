import React, {Component} from "react";

import axios    from "axios";
import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Aside }         from "@dashboardComponents/Tools/Aside";

import helper       from "@userPages/components/Biens/helper";
import DataState    from "@userPages/components/Biens/Form/data";
import Formulaire   from "@dashboardComponents/functions/Formulaire";

import { ProspectsList }      from "@dashboardPages/components/Immo/Prospects/ProspectsList";
import { ProspectFormulaire } from "@dashboardPages/components/Immo/Prospects/ProspectForm";

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
        switch (context){
            case "create":
                this.aside.current.handleOpen("Ajouter un prospect");
                break;
            default:
                this.aside.current.handleOpen("Sélectionner un existant");
                break;
        }

        this.setState({ context })
    }

    handleSelectProspect = (prospect) => {
        const { elem } = this.props;
        const { data } = this.state;

        let nData = helper.addOrRemove(data, prospect, "Prospect ajouté.", "Prospect enlevé.");
        this.setState({ data: nData });

        axios.post(Routing.generate('api_suivis_link_bien', {'id': elem.id}), nData)
            .catch(function (error) {
                Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
            })
        ;
    }

    render () {
        const { societyId, agencyId, negotiators } = this.props;
        const { context, data, allProspects } = this.state;

        let contentAside;
        switch (context) {
            case "create":
                contentAside = <ProspectFormulaire type="create" negotiators={negotiators} isClient={true}
                                                   societyId={societyId} agencyId={agencyId} />;
                break
            default:
                contentAside = <ProspectsList isSelect={true} isFromRead={true} isClient={true} data={allProspects} prospects={data}
                                             onSelectProspect={this.handleSelectProspect} />
                break;
        }

        return (<div className="details-tab-infos">
            <ProspectsList isFromRead={true} isClient={true} data={data}
                           onChangeContext={this.handleChangeContext}
                           onSelectProspect={this.handleSelectProspect} />

            <Aside ref={this.aside} content={contentAside}/>
        </div>)
    }

}
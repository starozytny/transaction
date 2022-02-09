import React, {Component} from "react";

import axios    from "axios";
import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Aside }      from "@dashboardComponents/Tools/Aside";
import { Alert }      from "@dashboardComponents/Tools/Alert";
import { ButtonIcon } from "@dashboardComponents/Tools/Button";

import helper       from "@userPages/components/Biens/helper";
import DataState    from "@userPages/components/Biens/Form/data";
import Sort         from "@commonComponents/functions/sort";
import Formulaire   from "@dashboardComponents/functions/Formulaire";

import { ProspectsList }      from "@dashboardPages/components/Immo/Prospects/ProspectsList";
import { ProspectFormulaire } from "@dashboardPages/components/Immo/Prospects/ProspectForm";

const URL_DELETE_ELEMENT = 'api_suivis_delete';
const MSG_DELETE_ELEMENT = 'Supprimer ce prospect ?';
const SORTER = Sort.compareLastname;

export class Rapprochements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            sorter: SORTER,
            data: props.data,
            element: null,
            allProspects: [],
        }

        this.aside = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleSelectProspect = this.handleSelectProspect.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        DataState.getProspects(this);
    }

    handleChangeContext = (context, element) => {
        switch (context){
            case "update":
                this.aside.current.handleOpen("Modifier " + element.fullname);
                break;
            case "create":
                this.aside.current.handleOpen("Ajouter un prospect");
                break;
            default:
                this.aside.current.handleOpen("Sélectionner un existant");
                break;
        }

        this.setState({ context, element })
    }

    handleUpdateList = (element, newContext=null) => {
        const { data, context, sorter} = this.state

        Formulaire.updateData(this, sorter, newContext, context, data, element);
        DataState.getProspects(this);
    }

    handleDelete = (element, text='Cette action est irréversible.') => {
        let url = Routing.generate(URL_DELETE_ELEMENT, {'id': element.id, "bien": this.props.elem.id})
        Formulaire.axiosDeleteElement(this, element, url, MSG_DELETE_ELEMENT, text);
    }

    handleSelectProspect = (prospect) => {
        const { elem } = this.props;
        const { data } = this.state;

        let nData = helper.addOrRemove(data, prospect, "Prospect ajouté.", "Prospect enlevé.");
        this.setState({ data: nData });

        const self = this;
        axios.post(Routing.generate('api_suivis_link_bien', {'id': elem.id}), nData)
            .catch(function (error) {
                Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
            })
        ;
    }

    render () {
        const { elem, societyId, agencyId, negotiators } = this.props;
        const { context, data, allProspects, sorter, element } = this.state;

        data.sort(sorter)

        let contentAside;
        switch (context) {
            case "update":
                contentAside = <ProspectFormulaire type="update" isFromRead={true} isClient={true} element={element} bienId={elem.id} negotiators={negotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateList}/>;
                break
            case "create":
                contentAside = <ProspectFormulaire type="create" isFromRead={true} isClient={true} bienId={elem.id} negotiators={negotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateList}/>;
                break
            default:
                contentAside = <ProspectsList isSelect={true} isFromRead={true} isClient={true} data={allProspects} prospects={data}
                                             onSelectProspect={this.handleSelectProspect} onDelete={this.handleDelete} />
                break;
        }

        return (<div className="details-tab-infos">
            {data && data.length !== 0 ? data.map(elem => {
                return <RapprochementsItem prospect={elem.prospect} bien={elem.bien} />
            }) : <Alert>Aucun résultat</Alert>}

            <Aside ref={this.aside} content={contentAside}/>
        </div>)
    }
}

export function RapprochementsItem ({ prospect, bien }) {
    return <div className="card-ad">
        <div className="card-main">
            <div className="card-body">
                <div className="infos">
                    <div className="col-1">
                        <div className="identifier">
                            <div className="title">
                                <span>{prospect.fullname}</span>
                            </div>
                            <div className="address">
                                <div>{prospect.email}</div>
                                <div>{prospect.phone1}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="badges">
                            <div className="status">{bien.typeAdString}</div>
                            <div className="status">{bien.typeBienString}</div>
                        </div>
                        <div className="identifier">
                            <div className="price">Price</div>
                            <div className="price">Piece - Rooms</div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="ra-percentage">
                            <div>80%</div>
                        </div>
                        <div className="negociateur">
                            <div className="avatar">
                                <img src={prospect.negotiator.avatarFile} alt="Avatar du negociateur" />
                            </div>
                            <span className="tooltip">{prospect.negotiator.fullname}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <div className="commentary">Commentaire : </div>

                <div className="footer-actions">
                    <div className="actions">
                        <ButtonIcon icon="phone" text={"0"}>0 mails envoyés</ButtonIcon>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
import React, { Component } from 'react';

import axios        from "axios";
import Swal         from "sweetalert2";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout } from "@dashboardComponents/Layout/Page";

import AgendaData from "@userPages/components/Agenda/agendaData";
import Formulaire from "@dashboardComponents/functions/Formulaire";

import { VisitsList }       from "@dashboardPages/components/Immo/Visits/VisitsList";
import { AgendaFormulaire } from "@userPages/components/Agenda/AgendaForm";

const URL_DELETE_ELEMENT = 'api_visits_delete';
const MSG_DELETE_ELEMENT = 'Supprimer cette visite ?';
const URL_GET_DATA       = 'api_agenda_data_persons';

export class Visits extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "visits.pagination",
            isSuiviPage: props.isSuiviPage ? props.isSuiviPage : false,
            classes: props.classes !== null ? props.classes : "main-content",

            users: props.users ? props.users : [],
            managers: props.managers ? props.managers : [],
            negotiators: props.negotiators ? props.negotiators : [],
            owners: props.owners ? props.owners : [],
            tenants: props.tenants ? props.tenants : [],
            prospects: props.prospects ? props.prospects : [],
            buyers: props.buyers ? props.buyers : [],
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
    }

    componentDidMount = () => { this.props.loadDataAgenda ? AgendaData.getData(this, URL_GET_DATA) : null }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => {
        this.layout.current.handleUpdateList(element, newContext);

        if(this.state.isFromRead){
            this.props.onUpdateVisits()
        }
    }

    handleDelete = (element) => {
        Swal.fire(SwalOptions.options(MSG_DELETE_ELEMENT, "Action irréversible"))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    const self = this;
                    axios.delete(Routing.generate(URL_DELETE_ELEMENT, {'id': element.id}), {})
                        .then(function (response) {
                            self.handleUpdateList(element, "delete");
                        })
                        .catch(function (error) {
                            Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                        .then(() => {
                            Formulaire.loader(false);
                        })
                    ;
                }
            })
        ;
    }

    handleContentList = (currentData, changeContext) => {
        return <VisitsList onChangeContext={changeContext}
                           onDelete={this.handleDelete}
                           isSuiviPage={this.state.isSuiviPage}
                           data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { users, managers, negotiators, owners, tenants, prospects } = this.state;

        return <AgendaFormulaire type="create" onChangeContext={changeContext} useAside={false}
                                 users={users} managers={managers} negotiators={negotiators} owners={owners} tenants={tenants}
                                 prospects={prospects} bienId={parseInt(this.props.bienId)}
                                 onUpdateList={this.handleUpdateList}
                                 url_create={'api_visits_create'}
        />
    }

    handleContentUpdate = (changeContext, element) => {
        const { users, managers, negotiators, owners, tenants, prospects } = this.state;

        let params = {'id': element.id};
        let elem = AgendaData.createEventStructure(element.agEvent, element);
        element = AgendaData.createElement(elem);

        return <AgendaFormulaire type="update" element={element} onChangeContext={changeContext} useAside={false}
                                 users={users} managers={managers} negotiators={negotiators} owners={owners} tenants={tenants}
                                 prospects={prospects} bienId={parseInt(this.props.bienId)}
                                 onUpdateList={this.handleUpdateList} url_update={'api_visits_update'} params_update={params}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}

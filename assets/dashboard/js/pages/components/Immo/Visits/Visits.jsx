import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";

import AgendaData from "@userPages/components/Agenda/agendaData";

import { VisitsList }       from "./VisitsList";
import { VisitFormulaire }  from "./VisitForm";
import { AgendaFormulaire } from "@userPages/components/Agenda/AgendaForm";

const URL_DELETE_ELEMENT = 'api_prospects_delete';
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
            isClient: props.isClient ? props.isClient : false,
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
    }

    componentDidMount = () => { AgendaData.getData(this, URL_GET_DATA); }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleContentList = (currentData, changeContext) => {
        return <VisitsList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
                           isClient={this.state.isClient}
                           data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { users, managers, negotiators, owners, tenants, prospects, biens } = this.state;

        return <AgendaFormulaire type="create" onUpdateList={this.handleUpdateList} onChangeContext={changeContext}
                                 users={users} managers={managers} negotiators={negotiators} owners={owners} tenants={tenants}
                                 prospects={prospects} biens={biens}
        />
    }

    handleContentUpdate = (changeContext, element) => {
        return <VisitFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}
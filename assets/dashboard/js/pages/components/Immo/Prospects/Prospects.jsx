import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { ProspectsList }       from "./ProspectsList";
import { ProspectFormulaire }  from "./ProspectForm";

const URL_DELETE_ELEMENT = 'api_prospects_delete';
const URL_DELETE_GROUP   = 'api_prospects_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer ce prospect ?';
const MSG_DELETE_GROUP   = 'Aucun prospect sélectionnés.';
const SORTER = Sort.compareLastname;

export class Prospects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "prospects.pagination",
            idAgency: parseInt(props.agencyId),
            idSociety: parseInt(props.societyId),
            societies: props.societies ? JSON.parse(props.societies) : [],
            agencies: props.agencies ? JSON.parse(props.agencies) : [],
            negotiators: props.negotiators ? JSON.parse(props.negotiators) : [],
            isClient: props.isClient ? props.isClient : false,
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "prospect"); }

    handleContentList = (currentData, changeContext) => {
        return <ProspectsList onChangeContext={changeContext}
                              onDelete={this.layout.current.handleDelete}
                              onDeleteAll={this.layout.current.handleDeleteGroup}
                              onSearch={this.handleSearch}
                              isClient={this.state.isClient}
                              data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <ProspectFormulaire type="create" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <ProspectFormulaire type="update" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency} element={element}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}
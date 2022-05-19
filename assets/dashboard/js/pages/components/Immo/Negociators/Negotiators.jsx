import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";

import Sort              from "@commonComponents/functions/sort";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { NegotiatorsList }       from "./NegotiatorsList";
import { NegotiatorFormulaire }  from "./NegotiatorForm";

const URL_DELETE_ELEMENT = 'api_negotiators_delete';
const MSG_DELETE_ELEMENT = 'Supprimer ce négociateur ?';
const URL_DELETE_GROUP   = 'api_negotiators_delete_group';
const MSG_DELETE_GROUP   = 'Aucun négociateur sélectionné.';
let SORTER = Sort.compareLastname;

let sorters = [
    { value: 0, label: 'Nom',           identifiant: 'sorter-nom' },
    { value: 1, label: 'Code',          identifiant: 'sorter-code' },
    { value: 2, label: 'Email',         identifiant: 'sorter-email' },
]

let sortersFunction = [Sort.compareLastname, Sort.compareCode, Sort.compareEmail];

export class Negotiators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: props.perPage ? props.perPage : 5,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "negotiators.pagination",
            agencyId: props.agencyId ? parseInt(props.agencyId) : "",
            agencies: props.agencies ? JSON.parse(props.agencies) : [],
            biens: props.biens ? JSON.parse(props.biens) : [],
            isClient: props.isClient ? props.isClient : false,
            isUser: props.isUser ? props.isUser : false,
            classes: props.classes ? props.classes : "main-content"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "negotiator"); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <NegotiatorsList onChangeContext={changeContext}
                                onDelete={this.layout.current.handleDelete}
                                onDeleteAll={this.layout.current.handleDeleteGroup}
                                onSearch={this.handleSearch}
                                //changeNumberPerPage
                                perPage={perPage}
                                onPerPage={this.handlePerPage}
                                //twice pagination
                                currentPage={currentPage}
                                onPaginationClick={this.layout.current.handleGetPaginationClick(this)}
                                taille={data.length}
                                //sorter
                                sorters={sorters}
                                onSorter={this.handleSorter}
                                //data
                                agencyId={this.state.agencyId}
                                isClient={this.state.isClient}
                                isUser={this.state.isUser}
                                biens={this.state.biens}
                                data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { agencies, isClient, isUser, agencyId } = this.state;
        return <NegotiatorFormulaire type="create" agencies={agencies} agencyId={agencyId} isClient={isClient} isUser={isUser}
                                     onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, agencyId) => {
        const { agencies, isClient, isUser, idAgency } = this.state;
        return <NegotiatorFormulaire type="update" agencies={agencies} agencyId={agencyId} isClient={isClient} isUser={isUser} element={element}
                                     onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
                    onChangeCurrentPage={this.handleChangeCurrentPage}/>
        </>
    }
}

import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { NegotiatorsList }      from "./NegotiatorsList";
import { NegotiatorFormulaire } from "@dashboardPages/components/Immo/Negociators/NegotiatorForm";

const URL_DELETE_ELEMENT    = 'api_negotiators_delete';
const MSG_DELETE_ELEMENT    = 'Supprimer ce négociateur ?';
const SORTER = Sort.compareLastname;

export class Negotiators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "user.negotiators.pagination",
            classes: ""
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "negotiator"); }

    handleContentList = (currentData, changeContext) => {
        return <NegotiatorsList onChangeContext={changeContext}
                                onDelete={this.layout.current.handleDelete}
                                onSearch={this.handleSearch}
                                isUser={this.props.isUser}
                                data={currentData} />
    }


    handleContentCreate = (changeContext) => {
        const { idAgency } = this.props;
        return <NegotiatorFormulaire type="create" agencyId={idAgency} isProfil={true} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { idAgency } = this.props;
        return <NegotiatorFormulaire type="update" agencyId={idAgency} isProfil={true} element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}
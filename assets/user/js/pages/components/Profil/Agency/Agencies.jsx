import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { AgenciesList }       from "./AgenciesList";
import { AgencyFormulaire }   from "@dashboardPages/components/Immo/Agencies/AgencyForm";

const SORTER = Sort.compareName;

export class Agencies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sorter: SORTER,
            sessionName: "user.agencies.pagination",
            classes: ""
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleContentList = (currentData, changeContext) => {
        const { role, idAgency, isUser } = this.props;
        return <AgenciesList role={role} onChangeContext={changeContext} idAgency={idAgency} isUser={isUser} data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { idSociety } = this.props;
        return <AgencyFormulaire type="create" societyId={idSociety} isProfil={true} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { idSociety } = this.props;
        return <AgencyFormulaire type="update" societyId={idSociety} isProfil={true} element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate} />
        </>
    }
}
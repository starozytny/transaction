import React, { Component } from 'react';

import axios       from "axios";
import Swal        from "sweetalert2";
import SwalOptions from "@commonComponents/functions/swalOptions";
import Routing     from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort              from "@commonComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { Layout }        from "@dashboardComponents/Layout/Page";

import { PublishesList } from "./PublishesList";

let SORTER = Sort.compareCreatedAtInverse;

let sorters = [
    { value: 0, label: 'Création',      identifiant: 'sorter-createdAt' },
    { value: 1, label: 'Modification',  identifiant: 'sorter-updatedAt' },
    { value: 2, label: 'Libellé',       identifiant: 'sorter-libelle' },
    { value: 3, label: 'Prix ->',       identifiant: 'sorter-price-desc' },
    { value: 4, label: 'Prix <-',       identifiant: 'sorter-price-asc' },
]

let sortersFunction = [Sort.compareCreatedAtInverse, Sort.compareUpdatedAtInverse, Sort.compareLibelle, Sort.compareFinancialPrice, Sort.compareFinancialPriceInverse];

export class Publishes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "supports.pagination",
            isUser: props.isUser === "1",
            publishes: props.publishes ? JSON.parse(props.publishes) : [],
            toPublishes: props.donnees ? JSON.parse(props.donnees) : [],
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleSelect = (elem, active) => {
        const { toPublishes } = this.state;

        let nToPublishes = toPublishes;
        if(active){
            nToPublishes = toPublishes.filter(el => el.id !== elem.id)
        }else{
            nToPublishes.push(elem);
        }

        this.setState({ toPublishes: nToPublishes })
    }

    handlePublish = () => {
        const { toPublishes } = this.state;

        let biens = [];
        toPublishes.forEach(item => {
            biens.push(item.id)
        })

        const self = this;
        Swal.fire(SwalOptions.options("Êtes-vous sûr de vouloir envoyer les nouvelles données aux plateformes de diffusions d'annonces ?", "Action irréversible."))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true)
                    axios.post(Routing.generate('api_immo_publish_send'), biens)
                        .then(function (response) {
                            Swal.fire(response.data.message, '', 'success');
                            setTimeout(function () {
                                location.reload();
                            }, 5000)
                        })
                        .catch(function (error) {
                            Formulaire.loader(false);
                            Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                    ;
                }
            })
        ;
    }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage, publishes, toPublishes } = this.state;

        return <PublishesList onChangeContext={changeContext}
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
                              onPublish={this.handlePublish}
                              publishes={publishes}
                              toPublishes={toPublishes}
                              onSelect={this.handleSelect}
                              isUser={this.state.isUser}
                              data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onChangeCurrentPage={this.handleChangeCurrentPage}/>
        </>
    }
}

import React, { Component } from 'react';

import axios   from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@dashboardComponents/functions/Formulaire";

import { Back }          from "@dashboardComponents/Layout/Elements";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";

export class SearchRead extends Component {
    constructor(props) {
        super();

        this.state = {
            loadData: true
        }
    }

    componentDidMount = () => {
        const { elem } = this.props;

        let self = this;
        axios({ method: "GET", url: Routing.generate('api_searchs_results', {'id': elem.id}) })
            .then(function (response) {
                let data = response.data;
                self.setState({ loadData: false })
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
        ;
    }

    render () {
        const { onChangeContext } = this.props;
        const { loadData } = this.state;

        return loadData ? <LoaderElement /> : <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="search-read">
                    <div className="col-1">
                        <div className="title">Biens</div>
                    </div>
                    <div className="col-2">Biens similaires</div>
                </div>
            </div>
        </>
    }
}
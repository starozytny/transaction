import React, { Component } from 'react';

import axios   from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@dashboardComponents/functions/Formulaire";

import { Button }        from "@dashboardComponents/Tools/Button";
import { Alert }         from "@dashboardComponents/Tools/Alert";
import { ButtonBack }    from "@dashboardComponents/Layout/Elements";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";

import { AdCard }        from "@userPages/components/Biens/AdCard";

export class SearchRead extends Component {
    constructor(props) {
        super();

        this.state = {
            context: 'main',
            loadData: true,
            data: [],
            data2: []
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    componentDidMount = () => {
        const { elem } = this.props;

        let self = this;
        axios({ method: "GET", url: Routing.generate('api_searchs_results', {'id': elem.id}) })
            .then(function (response) {
                let data = response.data;
                self.setState({ loadData: false, data: JSON.parse(data.main), data2: JSON.parse(data.second) })
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
        ;
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { onChangeContext } = this.props;
        const { loadData, context, data, data2 } = this.state;

        return loadData ? <LoaderElement /> : <>
            <div className="page-default">
                <div className="page-col-1">
                    <div className="comeback">
                        <ButtonBack onChangeContext={onChangeContext} />
                    </div>
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Recherche de base :</span>
                        </div>
                        <div className="content-col-1">
                            <Button type={context === "main" ? "primary" : "default"}
                                    onClick={() => this.handleChangeContext("main")}>
                                Basique
                            </Button>
                        </div>
                        <div className="title-col-1">
                            <span>Elargir la recherche :</span>
                        </div>
                        <div className="content-col-1">
                            <Button type={context !== "main" ? "primary" : "default"}
                                    onClick={() => this.handleChangeContext("second")}>
                                Avancée
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div>
                        <DataBiens data={context === "main" ? data : data2} />
                    </div>
                </div>
            </div>
        </>
    }
}

function DataBiens ({ data }) {
    return <div className="content">
        {data.length !== 0 ? data.map(el => {
            return <AdCard el={el} key={el.id}/>
        }) : <Alert>Aucun résultat</Alert>}
    </div>
}
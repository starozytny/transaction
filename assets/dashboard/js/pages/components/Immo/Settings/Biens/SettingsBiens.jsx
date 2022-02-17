import React, { Component } from 'react';

import { Quartiers } from "@dashboardPages/components/Immo/Settings/Biens/Quartiers/Quartiers";
import {PageInfos} from "@userComponents/Layout/Page";

export class SettingsBiens extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "quartier"
        }

        this.layout = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { quartiers } = this.props;
        const { context } = this.state;

        let menu = [
            { value: "quartier", label: "Quartiers" },
            { value: "sol",      label: "Sols" },
        ];

        let content;
        switch (context){
            case "sol":
                content = <div>Sols</div>
                break;
            default:
                content = <div id="list-quartiers">
                    <Quartiers donnees={quartiers} />
                </div>
                break;
        }

        return <div className="main-content">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Infos biens :</span>
                        </div>
                        <div className="content-col-1">
                            <div className="page-default-menu">
                                <div className="items">
                                    {menu.map((el, index) => {
                                        return <div key={index} className={"item" + (el.value === context ? " active" : "")}
                                                    onClick={() => this.handleChangeContext(el.value)}
                                        >
                                            {el.label}
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <PageInfos>
                        <p>
                            Les données ci-dessous représentent les éléments sélectionnables lors de la
                            création ou la modification d'un bien.
                            <br/><br/>
                            Les éléments en <span className="badge">Natif</span> ne peuvent pas être supprimés ou modifiés.
                        </p>
                    </PageInfos>
                    {content}
                </div>
            </div>
        </div>
    }
}
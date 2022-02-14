import React, { Component } from 'react';

import { Quartiers } from "@dashboardPages/components/Immo/Settings/Biens/Quartiers/Quartiers";

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
            { value: "quartier", label: "Quartier" }
        ];

        let content;
        switch (context){
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
                            {menu.map((el, index) => {
                                return <div key={index} onClick={() => this.handleChangeContext(el.value)}>{el.label}</div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    {content}
                </div>
            </div>
        </div>
    }
}
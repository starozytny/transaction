import React, { Component } from 'react';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Back } from "@dashboardComponents/Layout/Elements";

export class SearchRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        return <>
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
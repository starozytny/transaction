import React, { Component } from 'react';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Back } from "@dashboardComponents/Layout/Elements";

export class SocietyRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="item-read">

                    <div className="item-read-infos">
                        <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} >Modifier</ButtonIcon>
                        </div>
                        <div className="item-read-infos-container">
                            <div className="avatar">
                                <img src={elem.logoFile} alt={`Logo de ${elem.name}`}/>
                            </div>

                            <div className="main-infos">
                                <div className="name">
                                    <div>#{elem.codeString}</div>
                                    <span>{elem.name}</span>
                                </div>
                            </div>

                            <div className="footer-infos">
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    }
}
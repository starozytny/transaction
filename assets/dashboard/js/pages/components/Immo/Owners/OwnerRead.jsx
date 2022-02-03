import React, { Component } from 'react';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Back } from "@dashboardComponents/Layout/Elements";

export class OwnerRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        console.log(elem)

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="item-read">

                    <div className="item-read-infos item-read-infos-without-img">
                        <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} >Modifier</ButtonIcon>
                        </div>
                        <div className="item-read-infos-container">

                            <div className="main-infos">
                                <div className="name">
                                    <div>#{elem.code}</div>
                                    <span>{elem.fullname}</span>
                                </div>
                            </div>

                            <div className="footer-infos">
                            </div>
                        </div>
                    </div>

                    <div className="item-read-content">
                    </div>

                </div>
            </div>
        </>
    }
}
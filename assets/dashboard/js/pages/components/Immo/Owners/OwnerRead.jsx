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
                                <div className="username">
                                    <span>({elem.agency.name})</span>
                                </div>
                                <div className="sub">{elem.email}</div>
                                <div className="sub">{elem.phone1}</div>
                                <div className="sub">{elem.phone2}</div>
                                <div className="username">
                                    <span>{elem.phone3}</span>
                                </div>
                                <div className="sub">{elem.fullAddress}</div>
                            </div>

                            <div className="footer-infos">
                                {elem.isGerance && <>
                                    <div className="badge role-time">Gérance</div>
                                    <div className="badge role-time">{elem.codeGerance}</div>
                                </>}
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
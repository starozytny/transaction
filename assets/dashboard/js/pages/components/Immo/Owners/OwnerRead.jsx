import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Back }         from "@dashboardComponents/Layout/Elements";
import { AdCard }       from "@userPages/components/Biens/AdCard";
import { Alert }        from "@dashboardComponents/Tools/Alert";

export class OwnerRead extends Component {
    render () {
        const { elem, onChangeContext, biens } = this.props;

        let totalBiens = 0;
        let itemsBien = [];
        if(biens) {
            biens.forEach(bien => {
                if (bien.owner && bien.owner.id === elem.id) {
                    itemsBien.push(bien);
                    totalBiens++;
                }
            })
        }

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="item-read">

                    <div className="item-read-infos item-read-infos-without-img">
                        {!elem.isGerance && <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} >Modifier</ButtonIcon>
                        </div>}

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
                                <div className="username">
                                    <span>{elem.fullAddress}</span>
                                </div>

                                {elem.negotiator && <div className="sub">Négociateur : {elem.negotiator.fullname}</div>}

                            </div>

                            <div className="footer-infos">
                                {elem.isGerance && <>
                                    <div className="badge role-time">Gérance</div>
                                    <div className="badge role-time">{elem.codeGerance}</div>
                                    <div className="badge">{totalBiens} biens</div>
                                </>}
                            </div>
                        </div>
                    </div>

                    <div className="item-read-content">
                        <div className="content">
                            {itemsBien.length !== 0 ? itemsBien.map(el => {
                                return <AdCard el={el} isOwnerPage={true} key={el.id}/>
                            }) : <Alert>Aucun bien</Alert>}
                        </div>
                    </div>

                </div>
            </div>
        </>
    }
}
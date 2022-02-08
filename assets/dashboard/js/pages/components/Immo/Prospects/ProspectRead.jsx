import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Back }         from "@dashboardComponents/Layout/Elements";
import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";

export class ProspectRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="item-read">

                    <div className="item-read-infos item-read-infos-without-img">
                        <div className="actions">
                            <ButtonIcon icon="search" onClick={() => onChangeContext('update', elem)} >Recherches</ButtonIcon>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} >Modifier</ButtonIcon>
                        </div>

                        <div className="item-read-infos-container">

                            <div className="main-infos">
                                <div className="name">
                                    <span>{elem.fullname}</span>
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

                                {elem.lastContactAtAgo && <div className="username">
                                    <div className="sub">Dernier contact : {elem.lastContactAtAgo}</div>
                                </div>}

                                {elem.isArchived && <div className="badge badge-warning">Archivé</div>}
                            </div>

                            <div className="footer-infos">
                                <NegotiatorBubble elem={elem.negotiator} txt={null}/>
                            </div>

                            <div className="footer-infos">
                                <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                                <div className="badge role-time">Type de prospect : {elem.typeString}</div>
                            </div>
                        </div>
                    </div>

                    <div className="item-read-content">
                        <div className="content">

                        </div>
                    </div>

                </div>
            </div>
        </>
    }
}
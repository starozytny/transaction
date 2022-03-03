import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Actions from "@userComponents/functions/actions";

import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import { MailAside }    from "@dashboardPages/components/Mails/MailAside";

export class NegotiatorsItem extends Component {
    constructor(props) {
        super(props);

        this.mail = React.createRef();
    }

    render () {
        const { agencyId, isClient, isUser, biens, elem, onDelete, onChangeContext, onSelectors } = this.props

        let totalBien = 0;
        biens.forEach(bien => {
            if(bien.negotiator && bien.negotiator.id === elem.id){
                totalBien++;
            }
        })

        let actions = Actions.getDefaultAction(isClient, elem, "negotiator", this.mail);
        actions = actions.concat([
            {data: <a target="_blank" href={Routing.generate('user_printer_negotiator_rapport', {'id': elem.id})}>Imprimer rapport</a>},
        ])

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}

            <div className="item-content">
                <div className="item-body item-body-image">
                    <div className="item-image">
                        <img src={elem.avatarFile} alt={`Avatar de ${elem.fullname}`}/>
                    </div>
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <div className="role">{elem.code}</div>
                                <span>{elem.lastname} {elem.firstname}</span>
                            </div>
                            <div className="sub">{elem.email}</div>
                            <div className="sub">{elem.agency.name}</div>
                        </div>
                        <div className="col-2">
                            {elem.phone && <div className="sub">{elem.phone}</div>}
                            {elem.phone2 && <div className="sub">{elem.phone2}</div>}
                            {elem.fullTransportString !== null ? <div className="sub">{elem.fullTransportString}</div> : ""}
                            {biens.length !== 0 && <div className="sub">{totalBien} bien{totalBien > 1 ? "s" : ""}</div>}
                        </div>
                        <div className="col-3 actions">
                            {(biens.length !== 0 && totalBien !== 0) &&
                                <ButtonIcon icon="layer" element="a" onClick={Routing.generate('user_biens', {'fn': elem.id})}>
                                    Biens
                                </ButtonIcon>}

                            {agencyId === elem.agency.id && <>
                                <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                {!isUser && <>
                                    <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                                </>}
                            </>}

                            <ButtonIconDropdown icon="dropdown" items={actions}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>

            <MailAside ref={this.mail} to={[elem.email]} />
        </div>
    }
}

export function NegotiatorBubble ({ elem, txt="/" }) {
    return <>
        {elem ? <div className="negotiator-bubble">
            <div className="image">
                <img src={elem.avatarFile} alt={"negociateur avatar " + elem.fullname}/>
            </div>
            <div className="title">
                <span>{elem.fullname}</span>
            </div>
        </div> : txt}
    </>
}

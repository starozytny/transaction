import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import { MailAsideButton } from "@dashboardPages/components/Mails/MailAside";

export class ContactItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1" onClick={() => onChangeContext('read', elem)}>
                            <div className="name">
                                {!elem.isSeen && <span className="toSee" />}
                                <span>{elem.name}</span>
                            </div>
                            <div className="sub">{elem.email}</div>
                        </div>
                        <div className="col-2">
                            <div className="sub">{elem.createdAtAgo}</div>
                        </div>
                        <div className="col-3 actions">
                            <MailAsideButton txtBtn="Répondre" title={"Répondre à " + elem.name} to={[elem.email]} />
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

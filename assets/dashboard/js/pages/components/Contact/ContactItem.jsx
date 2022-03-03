import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import { Aside } from "@dashboardComponents/Tools/Aside";
import { MailFormulaire } from "@dashboardPages/components/Mails/MailFormAdvanced";

export class ContactItem extends Component {
    constructor(props) {
        super(props);

        this.aside = React.createRef();

        this.handleOpenAside = this.handleOpenAside.bind(this);
    }

    handleOpenAside = (title = "") => {
        this.aside.current.handleOpen(title);
    }

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
                            <ButtonIcon icon="chat-2" onClick={() => this.handleOpenAside("Répondre à " + elem.name)}>Répondre</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>


            <Aside ref={this.aside} content={<MailFormulaire refAside={this.aside} to={[{value: elem.email, label: elem.email}]} />} />
        </div>
    }
}

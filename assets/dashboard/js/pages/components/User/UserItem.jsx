import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class UserItem extends Component {
    render () {
        const { isClient, minimal, developer, elem, onChangeContext, onDelete, onSelectors } = this.props

        let routeName = 'user_homepage'
        if(elem.highRoleCode === 2){
            routeName = 'admin_homepage'
        }

        let url = Routing.generate(routeName, {'_switch_user' : elem.username})

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body item-body-image">
                    <div className="item-image" onClick={() => onChangeContext('read', elem)}>
                        <img src={elem.avatarFile} alt={`Avatar de ${elem.username}`}/>
                    </div>
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.lastname.toUpperCase()} {elem.firstname}</span>
                                {elem.highRoleCode !== 0 && <span className={"badge badge-" + elem.highRoleCode}>{elem.highRole}</span>}
                            </div>
                            {!isClient && <div className="sub">#{elem.society.codeString} - {elem.society.name}</div>}
                            {elem.highRoleCode !== 1 && elem.lastLoginAgo && <div className="sub">Connecté {elem.lastLoginAgo}</div>}
                        </div>
                        <div className="col-2">
                            <div className="sub sub-username">{elem.username}</div>
                            {elem.email !== "undefined@undefined.fr" ? <div className="sub sub-username">{elem.email}</div> : <div className="sub  sub-username txt-danger"><span className="icon-warning" /> {elem.email}</div>}
                        </div>
                        <div className="col-3 actions">
                            {(!isClient && elem.highRoleCode !== 1) &&
                            <>
                                <ButtonIcon icon="vision" onClick={() => onChangeContext("read", elem)}>Profil</ButtonIcon>
                                {!minimal && <>
                                    <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                                    {developer === 1 && <ButtonIcon icon="share" element="a" target="_blank" onClick={url}>Imiter</ButtonIcon>}
                                </>}
                            </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
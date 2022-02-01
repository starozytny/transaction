import React, { Component } from 'react';

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

export class SocietyRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item">
                        <Button outline={true} icon="left-arrow" type="primary" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                    </div>
                </div>

                <div className="item-user-read">

                    <div className="user-read-infos">
                        <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} >Modifier</ButtonIcon>
                        </div>
                        <div className="user-read-infos-container">
                            {/*<div className="avatar">*/}
                            {/*    <img src={avatar} alt={`Avatar de ${elem.username}`}/>*/}
                            {/*</div>*/}

                            <div className="main-infos">
                                <div className="name">
                                    <div>#{elem.code}</div>
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
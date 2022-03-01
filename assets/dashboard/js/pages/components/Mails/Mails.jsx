import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";
import {Alert} from "@dashboardComponents/Tools/Alert";

export class Mails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            element: null,
            sent: props.sent ? JSON.parse(props.sent) : []
        }
    }

    render () {
        const { sent, element } = this.state;

        let menu = [
            { icon: "email", label: "Envoyés", total: 52 }
        ];

        return <div className="main-content">
            <div className="boite-mail">
                <div className="col-1">
                    <div className="mail-add">
                        <Button icon="email">Nouveau message</Button>
                    </div>
                    <div className="mail-menu">
                        <div className="items">
                            {menu.map((item, index) => {
                                return <div className="item" key={index}>
                                    <div className="name">
                                        <span className={"icon-" + item.icon} />
                                        <span>{item.label}</span>
                                    </div>

                                    <div className="total">
                                        <span>{item.total}</span>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="mail-mails">
                        <div className="title">
                            <span className="icon-email" />
                            <span>Envoyés</span>
                        </div>
                        <div className="items">
                            {sent.map(elem => {
                                return <div className="item" key={elem.id}>
                                    <div className="expeditor">
                                        <div className="avatar">
                                            <span>{elem.expeditor.substring(0,1).toUpperCase()}</span>
                                        </div>
                                        <div className="content">
                                            <div className="name">{elem.expeditor}</div>
                                            <div className="subject">{elem.subject}</div>
                                        </div>
                                    </div>
                                    <div className="createdAt">
                                        <div>10:30</div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="mail-content">
                        {element ? "element" : <Alert type="reverse">Sélectionner un mail</Alert>}
                    </div>
                </div>
            </div>
        </div>
    }
}

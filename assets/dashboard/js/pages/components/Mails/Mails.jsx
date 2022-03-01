import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";

export class Mails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sent: props.sent ? JSON.parse(props.sent) : []
        }
    }

    render () {

        let menu = [
            { icon: "email", label: "Envoyés", total: 52 }
        ]

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
                        <div className="items">
                            <div className="item">
                                Message
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="mail-content">
                        <p>Content</p>
                    </div>
                </div>
            </div>
        </div>
    }
}

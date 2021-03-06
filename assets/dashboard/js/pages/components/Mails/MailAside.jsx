import React, { Component } from 'react';

import { Aside } from "@dashboardComponents/Tools/Aside";
import { MailFormulaire } from "@dashboardPages/components/Mails/MailForm";
import { ButtonIcon } from "@dashboardComponents/Tools/Button";

export class MailAsideButton extends Component {
    constructor(props) {
        super(props);

        this.mail = React.createRef();
    }

    render () {
        const { isDoubleAside=false, isBtnIcon = true, tooltipWidth=null, txtBtn = "Envoyer un mail",
            title, icon = "chat-2", to = [], cc = [], bcc = [] } = this.props;

        return <>
            {isBtnIcon ? <ButtonIcon icon={icon} tooltipWidth={tooltipWidth} onClick={() => this.mail.current.handleOpenAside(title)}>{txtBtn}</ButtonIcon>
                : <div onClick={() => this.mail.current.handleOpenAside(title)}>{txtBtn}</div>}
            <MailAside ref={this.mail} to={to} cc={cc} bcc={bcc} isDoubleAside={isDoubleAside} />
        </>
    }
}

export class MailAside extends Component {
    constructor(props) {
        super(props);

        this.aside = React.createRef();

        this.handleOpenAside = this.handleOpenAside.bind(this);
    }

    handleOpenAside = (title = "") => {
        this.aside.current.handleOpen(title);
    }

    render () {
        const { isDoubleAside, to = [], cc = [], bcc = [] } = this.props;

        return <>
            <Aside ref={this.aside} isDoubleAside={isDoubleAside} content={<MailFormulaire refAside={this.aside}
                                                             to={getData(to)}
                                                             cc={getData(cc)}
                                                             bcc={getData(bcc)} />} />
        </>
    }
}

function getData(data){
    let nData = [];
    data.forEach(email => {
        nData.push({ value: email, label: email })
    })

    return nData;
}

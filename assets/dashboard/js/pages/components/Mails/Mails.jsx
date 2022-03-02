import React, { Component } from "react";

import axios  from "axios";
import toastr from "toastr";
import parse  from "html-react-parser";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort       from "@commonComponents/functions/sort";
import Formulaire from "@dashboardComponents/functions/Formulaire";

import { Alert }  from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

const SORTER = Sort.compareCreatedAtInverse;

const URL_TRASH_ELEMENT = "api_mails_trash";
const URL_RESTORE_ELEMENT = "api_mails_restore";

function updateStatus (self, url, element, context, messageSuccess) {
    axios({ method: "PUT", url: Routing.generate(url, {'id': element.id}), data: {} })
        .then(function (response) {
            toastr.info(messageSuccess);
            self.handleUpdateList(response.data, context);
        })
        .catch(function (error) {
            Formulaire.displayErrors(self, error);
        })
    ;
}

export class Mails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "trash",
            element: props.trash ? JSON.parse(props.trash)[0] : null,
            sent: props.sent ? JSON.parse(props.sent) : [],
            trash: props.trash ? JSON.parse(props.trash) : [],
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSelectMail = this.handleSelectMail.bind(this);
        this.handleTrash = this.handleTrash.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
    }

    handleChangeContext = (context) => {
        this.setState({ context: context, element: null })
    }

    handleUpdateList = (element, context) => {
        const { sent, trash } = this.state;

        let nSent = sent;
        let nTrash = trash;

        switch (context){
            case "restore":
                if(element.statusOrigin === 2){
                    nSent.push(element);
                }
                nTrash = trash.filter(el => el.id !== element.id);
                break;
            case "trash":
                nSent = sent.filter(el => el.id !== element.id);
                nTrash.push(element);
                break;
            default:
                break;
        }

        nSent.sort(SORTER)
        nTrash.sort(SORTER)
        this.setState({ sent: nSent, trash: nTrash })
    }

    handleSelectMail = (element) => { this.setState({ element }) }

    handleTrash = (element) => {
        updateStatus(this, URL_TRASH_ELEMENT, element, "trash", "Message mis à la corbeille.")
    }

    handleRestore = (element) => {
        updateStatus(this, URL_RESTORE_ELEMENT, element, "restore", "Message restauré.")
    }

    render () {
        const { context, sent, trash, element } = this.state;

        let menu = [
            { context: 'sent',  icon: "email-tracking", label: "Envoyés",   total: sent.length, data: sent },
            { context: 'trash', icon: "trash",          label: "Corbeille", total: trash.length, data: trash },
        ];

        let data = [];
        let menuActive = null;
        let menuItems = menu.map((item, index) => {
            let active = false;
            if(item.context === context){
                menuActive = item;
                active = true;
                data = item.data;
            }

            return <div className={"item " + active} key={index} onClick={() => this.handleChangeContext(item.context)}>
                <div className="name">
                    <span className={"icon-" + item.icon} />
                    <span>{item.label}</span>
                </div>

                <div className="total">
                    <span>{item.total}</span>
                </div>
            </div>
        })

        return <div className="main-content">
            <div className="boite-mail">
                <div className="col-1">
                    <div className="mail-add">
                        <Button icon="email-edit">Nouveau message</Button>
                    </div>
                    <div className="mail-menu">
                        <div className="items">{menuItems}</div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="mail-list">
                        <div className="title">
                            <span className={"icon-" + menuActive.icon} />
                            <span>{menuActive.label}</span>
                        </div>
                        <div className="items">
                            {data.length !== 0  ? data.map(elem => {
                                return <ItemsMail  key={elem.id} elem={elem} element={element}
                                                  onSelectMail={this.handleSelectMail} />
                            }) : <div className="item"><Alert withIcon={false}>Aucun résultat.</Alert></div>}
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="mail-item">
                        {element ? <ItemMail elem={element}
                                             onTrash={this.handleTrash}
                                             onRestore={this.handleRestore}
                            /> : data.length !== 0 ? <Alert type="info">Sélectionner un mail</Alert> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

function ItemsMail ({ elem, element, onSelectMail }) {
    return <div className={"item " + (element && element.id === elem.id)} key={elem.id} onClick={() => onSelectMail(elem)}>
        <div className="expeditor">
            <div className="avatar">
                <span>{elem.status !== 3 ? elem.expeditor.substring(0,1).toUpperCase() : <span className="icon-trash" />}</span>
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
}

function ItemMail ({ elem, onTrash, onRestore }) {
    return <div className="item">

        <div className="actions">
            <div className="col-1">
                <div className="createdAt">{elem.createdAtString}</div>
            </div>
            <div className="col-2">
                <ButtonIcon icon="trash" onClick={() => onTrash(elem)}>{elem.status !== 3 ? "Corbeille" : "Supprimer"}</ButtonIcon>
                {elem.status === 3 && <ButtonIcon icon="refresh1" onClick={() => onRestore(elem)}>Restaurer</ButtonIcon>}
            </div>
        </div>

        <div className="item-header">
            <div className="avatar">
                <span>{elem.expeditor.substring(0,1).toUpperCase()}</span>
            </div>
            <div className="content">
                <div className="name">From : {elem.expeditor}</div>
                <div className="createdAt">{elem.createdAtString}</div>
                <div className="destinators">To : {elem.destinators.map((dest, index) => {
                    return <span key={index}>{dest}</span>
                })}</div>
            </div>
        </div>

        <div className="item-body">
            <div className="subject">{elem.subject}</div>
            <div className="message">{parse(elem.message)}</div>
        </div>

    </div>
}

import React, { Component } from "react";

import axios    from "axios";
import toastr   from "toastr";
import parse    from "html-react-parser";
import Swal     from "sweetalert2";
import SwalOptions from "@commonComponents/functions/swalOptions";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort       from "@commonComponents/functions/sort";
import Formulaire from "@dashboardComponents/functions/Formulaire";

import { Alert }  from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

import { MailFormulaire } from "@dashboardPages/components/Mails/MailForm";

const SORTER = Sort.compareCreatedAtInverse;

const URL_TRASH_ELEMENT   = "api_mails_trash";
const URL_RESTORE_ELEMENT = "api_mails_restore";
const URL_DELETE_ELEMENT  = "api_mails_delete";
const URL_TRASH_GROUP   = "api_mails_trash_group";
const URL_RESTORE_GROUP = "api_mails_restore_group";
const URL_DELETE_GROUP  = "api_mails_delete_group";

const STATUS_INBOX = 0;
const STATUS_DRAFT = 1;
const STATUS_SENT = 2;
const STATUS_TRASH = 3;
const STATUS_ARCHIVED = 4;

function updateStatus (self, method, url, element, context, messageSuccess) {
    axios({ method: method, url: Routing.generate(url, {'id': element.id}), data: {} })
        .then(function (response) {
            toastr.info(messageSuccess);
            self.handleUpdateList(context !== "delete" ? response.data : element, context, element.status);
        })
        .catch(function (error) {
            Formulaire.displayErrors(self, error);
        })
    ;
}

function updateStatusGroup (self, method, url, selects) {
    Formulaire.loader(true);
    axios({ method: method, url: Routing.generate(url), data: selects })
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            Formulaire.loader(false);
            Formulaire.displayErrors(self, error);
        })
    ;
}

export class Mails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "draft",
            element: props.draft ? JSON.parse(props.draft)[0] : null,
            users: props.users ? JSON.parse(props.users) : [],
            sent: props.sent ? JSON.parse(props.sent) : [],
            trash: props.trash ? JSON.parse(props.trash) : [],
            draft: props.draft ? JSON.parse(props.draft) : [],
            selection: false,
            selects: []
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSelectMail = this.handleSelectMail.bind(this);
        this.handleTrash = this.handleTrash.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleSelection = this.handleSelection.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleChangeContext = (context, element = null) => {
        this.setState({ context: context, element: element, handleDelete: [], selection: false })
    }

    handleUpdateList = (element, context, status = null) => {
        const { sent, trash, draft } = this.state;

        let nSent = sent;
        let nDraft = draft;
        let nTrash = trash;

        switch (context){
            case "draft":
                let tmp = [];
                nDraft.forEach(el => {
                    if(el.id === element.id) el = element;
                    tmp.push(el);
                })
                nDraft = tmp;
                break;
            case "delete":
                nTrash = trash.filter(el => el.id !== element.id);
                break;
            case "restore":
                switch (element.statusOrigin){
                    case STATUS_SENT:
                        nSent.push(element);
                        break;
                    case STATUS_DRAFT:
                        nDraft.push(element);
                        break;
                    default:
                        break;
                }
                nTrash = trash.filter(el => el.id !== element.id);
                break;
            case "trash":
                switch (status){
                    case STATUS_SENT:
                        nSent = sent.filter(el => el.id !== element.id);
                        break;
                    case STATUS_DRAFT:
                        nDraft = draft.filter(el => el.id !== element.id);
                        break;
                    default:
                        break;
                }
                nTrash.push(element);
                break;
            default:
                break;
        }

        nSent.sort(SORTER)
        nTrash.sort(SORTER)
        nDraft.sort(SORTER)
        this.setState({ sent: nSent, trash: nTrash, draft: nDraft })
    }

    handleSelectMail = (element) => {
        this.setState({ element })
        let top = document.getElementById("read").offsetTop; //Getting Y of target element
        window.scrollTo(0, top);
    }

    handleTrash = (element, isMultiple = false) => {
        const { selects } = this.state;

        if(!isMultiple){
            updateStatus(this, "PUT", URL_TRASH_ELEMENT, element, "trash", "Message mis à la corbeille.")
        }else{
            updateStatusGroup(this, "PUT", URL_TRASH_GROUP, selects)
        }
    }

    handleRestore = (element,  isMultiple = false) => {
        const { selects } = this.state;

        if(!isMultiple){
            updateStatus(this, "PUT", URL_RESTORE_ELEMENT, element, "restore", "Message restauré.")
        }else{
            updateStatusGroup(this, "PUT", URL_RESTORE_GROUP, selects)
        }
    }

    handleDelete = (element,  isMultiple = false) => {
        const { selects } = this.state;

        Swal.fire(SwalOptions.options("Etes-vous sur de vouloir supprimer " + (!isMultiple ? "ce message" : "ces messages") + " ?", "Suppression définitive."))
            .then((result) => {
                if (result.isConfirmed) {
                    if(!isMultiple){
                        updateStatus(this, "DELETE", URL_DELETE_ELEMENT, element, "delete", "Message supprimé définitivement.")
                    }else{
                        updateStatusGroup(this, "DELETE", URL_DELETE_GROUP, selects)
                    }
                }
            })
        ;
    }

    handleSelection = () => { this.setState({ selection: !this.state.selection, selects: [], element: null }) }

    handleSelect = (element) => {
        const { selects } = this.state;

        let nSelects = selects;
        if(selects.includes(element)){
            nSelects = selects.filter(el => el !== element.id);
        }else{
            nSelects.push(element.id)
        }

        this.setState({ selects: nSelects })
    }

    render () {
        const { context, users, sent, trash, draft, element, selection, selects } = this.state;

        let menu = [
            { context: 'sent',  icon: "email-tracking", label: "Envoyés",   total: sent.length,  data: sent },
            { context: 'draft', icon: "pencil",         label: "Brouillon", total: draft.length, data: draft },
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
                        <Button icon="email-edit" onClick={() => this.handleChangeContext("create")}>Nouveau message</Button>
                    </div>
                    <div className="mail-menu">
                        <div className="items">{menuItems}</div>
                    </div>
                </div>
                {context !== "create" ? <>
                    <div className="col-2">
                        <div className="mail-list">
                            <div className="title">
                                <span className={"icon-" + menuActive.icon} />
                                <span>{menuActive.label}</span>
                            </div>
                            <div className="actions">
                                <div onClick={this.handleSelection}>
                                    <span>{selection ? "Annuler la sélection" : "Sélectionner des messages"}</span>
                                </div>
                            </div>
                            <div className="items">
                                {data.length !== 0  ? data.map(elem => {
                                    return <ItemsMail key={elem.id} elem={elem} element={element} selection={selection} selects={selects}
                                                      onSelectMail={this.handleSelectMail} onSelect={this.handleSelect} />
                                }) : <div className="item"><Alert withIcon={false}>Aucun résultat.</Alert></div>}
                            </div>
                        </div>
                    </div>
                    <div className="col-3" id="read">
                        <div className="mail-item">
                            {element ? <ItemMail elem={element}
                                                 onTrash={this.handleTrash}
                                                 onRestore={this.handleRestore}
                                                 onDelete={this.handleDelete}
                                                 onChangeContext={this.handleChangeContext}
                            /> : data.length !== 0 ? (selection ? <div>
                                {context === 'trash' ? <>
                                    <ButtonIcon icon="refresh1" text="Restaurer les messages sélectionnés" onClick={() => this.handleRestore(null, true)}/>
                                    <ButtonIcon icon="trash" text="Supprimer les messages sélectionnés" onClick={() => this.handleDelete(null, true)}/>
                                </> : <>
                                    <ButtonIcon icon="trash" text="Mettre à la corbeille les messages sélectionnés" onClick={() => this.handleTrash(null, true)}/>
                                </>}
                            </div> : <Alert type="info">Sélectionner un mail</Alert>) : null}
                        </div>
                    </div>
                </> : <>
                    <div className="col-2-expand">
                        <div className="mail-list">
                            <div className="title">
                                <span className="icon-email-edit" />
                                <span>Nouveau message</span>
                            </div>
                        </div>

                        <MailFormulaire users={users} element={element} onUpdateList={this.handleUpdateList} />

                        <div className="mail-list">
                            <div className="title">
                                <span className="icon-vision" />
                                <span>Prévisualisation</span>
                            </div>
                        </div>

                        <div id="preview" />
                    </div>
                </>}

            </div>
        </div>
    }
}

function ItemsMail ({ elem, element, selection, selects, onSelectMail, onSelect }) {

    let selectActive = false;
    selects.forEach(select => {
        if(select === elem.id){
            selectActive = true;
        }
    })

    let avatar = elem.expeditor.substring(0,1).toUpperCase();
    switch (elem.statusOrigin){
        case STATUS_DRAFT:
            avatar = <span className="icon-pencil" />
            break;
        case STATUS_SENT:
            avatar = <span className="icon-email-tracking" />
            break;
        default:
            break;
    }

    return <div className={"item" + (selection ? " selection " : " ") + (element && element.id === elem.id)} key={elem.id}
                onClick={selection ? () =>onSelect(elem) : () => onSelectMail(elem)}>
        <div className="expeditor">
            <div className={"avatar avatar-" + elem.statusOrigin }>
                <span>{avatar}</span>
            </div>
            <div className={"avatar selector " + selectActive}>
                <span className="icon-check-1"/>
            </div>
            <div className="content">
                <div className="name">{elem.expeditor}</div>
                <div className="subject">{elem.subject}</div>
            </div>
        </div>
        <div className="createdAt">
            <div>{elem.createdAtStringShort}</div>
        </div>
    </div>
}

function ItemMail ({ elem, onTrash, onRestore, onDelete, onChangeContext }) {
    return <div className="item">

        <div className="actions">
            <div className="col-1">
                <div className="createdAt">{elem.createdAtString}</div>
            </div>
            <div className="col-2">
                {elem.status !== STATUS_TRASH ? <ButtonIcon icon="trash" onClick={() => onTrash(elem)}>Corbeille</ButtonIcon>
                    : <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}

                {elem.status === STATUS_TRASH && <ButtonIcon icon="refresh1" onClick={() => onRestore(elem)}>Restaurer</ButtonIcon>}
                {elem.status === STATUS_DRAFT && <ButtonIcon icon="pencil" onClick={() => onChangeContext("create", elem)}>Continuer</ButtonIcon>}
            </div>
        </div>

        <div className="item-header">
            <div className="avatar">
                <span>{elem.expeditor.substring(0,1).toUpperCase()}</span>
            </div>
            <div className="content">
                <div className="name">
                    <div><span>From</span> <span>:</span></div>
                    <div className="items"><span>{elem.expeditor}</span></div>
                </div>
                <div className="createdAt">{elem.createdAtString}</div>
                <Destinators prefix="To" data={elem.destinators} />
                {elem.cc.length !== 0 ? <Destinators prefix="Cc" data={elem.cc} /> : null}
                {elem.bcc.length !== 0 ? <Destinators prefix="Cci" data={elem.bcc} /> : null}
            </div>
        </div>

        <div className="item-body">
            <div className="badges">
                <div className="badge badge-default">Thème utilisé : {elem.themeString}</div>
            </div>
            <div className="subject">{elem.subject}</div>
            <div className="message">{elem.message ? parse(elem.message) : ""}</div>
            <div className="files">
                {elem.files.map((file, index) => {
                    return <a className="file" key={index}
                              download={file} target="_blank"
                              href={Routing.generate('user_mails_attachement', {'filename': file})}
                    >
                        <span className="icon">
                            <span className="icon-file" />
                        </span>
                        <span className="infos">
                            <span className="name">Pièce jointe {index + 1}</span>
                        </span>
                    </a>
                })}
            </div>
        </div>

    </div>
}


function Destinators ({ prefix, data }) {
    return <div className="destinators">
        <div><span>{prefix}</span> <span>:</span></div>
        <div className="items">
            {data.map((dest, index) => {
                return <span key={index}>{dest.value}</span>
            })}
        </div>
    </div>
}

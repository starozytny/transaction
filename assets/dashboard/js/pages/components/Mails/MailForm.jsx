import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox, SelectizeMultiple } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { Drop }                from "@dashboardComponents/Tools/Drop";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_mails_create";
const URL_PREVIEW_ELEMENT    = "api_mails_preview";
const URL_DRAFT_ELEMENT      = "api_mails_draft";
const TXT_CREATE_BUTTON_FORM = "Envoyer";
let i = 0;

export function MailFormulaire ({ type = "create", users, element, from, to, cc, bcc, theme, refAside = null, onUpdateList })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    let form = <Form
        context={type}
        url={url}
        users={users ? users : []}
        from={from ? from : (element ? Formulaire.setValueEmptyIfNull(element.expeditor, null) : null)}
        to={to ? to : (element ? Formulaire.setValueEmptyIfNull(element.destinators, []) : [])}
        cc={cc ? cc : (element ? Formulaire.setValueEmptyIfNull(element.cc, []) : [])}
        bcc={bcc ? bcc : (element ? Formulaire.setValueEmptyIfNull(element.bcc, []) : [])}
        theme={theme ? theme : (element ? Formulaire.setValueEmptyIfNull(element.theme, 0) : 0)}
        subject={element ? Formulaire.setValueEmptyIfNull(element.subject, "") : ""}
        title={element ? Formulaire.setValueEmptyIfNull(element.title, "") : ""}
        message={element ? Formulaire.setValueEmptyIfNull(element.message, "") : ""}
        isDraft={!!element}
        id={element ? Formulaire.setValueEmptyIfNull(element.id, null) : null}
        refAside={refAside}

        onUpdateList={onUpdateList}
    />

    return <div className="form">{form}</div>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            from: props.from,
            to: props.to,
            cc: props.cc,
            bcc: props.bcc,
            theme: props.theme,
            subject: props.subject,
            title: props.title,
            message: { value: props.message, html: props.message },
            errors: [],
            success: false,
            showCc: !!props.cc.length,
            showBcc: !!props.bcc.length,
            isDraft: props.isDraft,
            id: props.id,
        }

        this.inputFiles = React.createRef();
        this.selectMultipleTo = React.createRef();
        this.selectMultipleCc = React.createRef();
        this.selectMultipleBcc = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleDraft = this.handleDraft.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        const { message } = this.state;
        let text = e.currentTarget.innerHTML;

        this.setState({message: {value: message.value, html: text}})
    }

    handleChangeSelectMultipleAdd = (name, valeurs, select) => {
        this.setState({ [name]: valeurs })
        select.current.handleUpdateValeurs(valeurs);
    }

    handleChangeSelectMultipleDel = (name, valeur, select) => {
        let valeurs = this.state[name].filter(v => v.value !== valeur.value);
        this.setState({ [name]: valeurs });
        select.current.handleUpdateValeurs(valeurs);
    }

    handlePreview = (e) => {
        const { theme, message } = this.state;

        e.preventDefault();

        let preview = document.getElementById("preview");

        if(parseInt(theme) === 0 ){
            preview.innerHTML = "<div>" +
                message.html +
                "</div>"
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            axios({ method: "POST", url: Routing.generate(URL_PREVIEW_ELEMENT), data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    preview.innerHTML = response.data
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(() => {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    handleDraft = (e) => {
        e.preventDefault();

        const { subject } = this.state;

        this.setState({ errors: [], success: false })

        let paramsToValidate = [
            {type: "text",  id: 'subject',  value: subject},
        ];
        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: Routing.generate(URL_DRAFT_ELEMENT), data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    toastr.info("Brouillon enregistré.");
                    self.setState({
                        isDraft: true,
                        id: response.data.id
                    })
                    if(self.props.onUpdateList){
                        self.props.onUpdateList(response.data, "draft")
                    }
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(function() {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, refAside } = this.props;
        const { to, cc, bcc, subject, title, message, theme } = this.state;

        this.setState({ errors: [], success: false })

        let paramsToValidate = [
            {type: "text",  id: 'subject',  value: subject},
            {type: "text",  id: 'message',  value: message},
            {type: "text",  id: 'theme',    value: theme}
        ];

        if(parseInt(theme) === 1){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "text", id: 'title', value: title}]
            ];
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        if(to.length === 0 && cc.length === 0 && bcc.length === 0){
            validate.code = false;
            validate.errors.push({
                name: "to", message: "Au moins 1 destinataire doit être renseigné dans TO ou CC ou CCI."
            })
        }

        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            let files = this.inputFiles.current.drop.current.files;
            files.forEach((f, index) => {
                formData.append("file" + index, f.file)
            })

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {

                    let message = !refAside ? response.data.message : "Message envoyé.";

                    Helper.toTop();
                    toastr.info(message);

                    if(!refAside) {
                        self.setState({ success: message, errors: [] });
                        setTimeout(function (){
                            location.reload();
                        }, 3000)
                    }else{
                        self.setState({
                            success: "Message envoyé.",
                            errors: [],
                            subject: "",
                            title: "",
                            message: {value: "", html: ""}
                        });
                        Formulaire.loader(false);
                        refAside.current.handleClose();
                    }

                })
                .catch(function (error) {
                    Formulaire.loader(false);
                    Formulaire.displayErrors(self, error);
                })
            ;
        }
    }

    render () {
        const { users } = this.props;
        const { errors, success, from, to, cc, bcc, showCc, showBcc, subject, title, message, theme } = this.state;

        let selectItems = [];
        if(users && users.length !== 0){
            users.forEach(el => {
                if(el.getHighRoleCode !== 1){
                    selectItems.push({ value: el.email, label: el.username, identifiant: 'us-' + el.id, test: "i" })
                }
            })
        }

        let themeItems = [
            { value: 0, label: "Aucun thème", id: "th-none" },
            { value: 1, label: "Classique", id: "th-classique" }
        ]

        return <>
            <form >

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-theme">
                    <Radiobox items={themeItems} identifiant="theme" valeur={theme} errors={errors} onChange={this.handleChange}>Thème</Radiobox>
                </div>

                {(!showCc || !showBcc) && <div className="line-dest-options">
                    <div className="actions">
                        {!showCc && <div onClick={() => this.setState({ showCc: true })}>Cc</div>}
                        {!showBcc &&  <div onClick={() => this.setState({ showBcc: true })}>Cci</div>}
                    </div>
                </div>}

                <div className="line line-dest line-to">
                    <SelectizeMultiple ref={this.selectMultipleTo} items={selectItems} identifiant="to" valeur={to}
                                       errors={errors}
                                       onChangeAdd={(e) => this.handleChangeSelectMultipleAdd("to", e, this.selectMultipleTo)}
                                       onChangeDel={(e) => this.handleChangeSelectMultipleDel("to", e, this.selectMultipleTo)}
                                       createType={"email"}
                    >
                        To
                    </SelectizeMultiple>
                </div>

                {showCc && <div className="line line-dest">
                    <SelectizeMultiple ref={this.selectMultipleCc} items={selectItems} identifiant="cc" valeur={cc}
                                       errors={errors}
                                       onChangeAdd={(e) => this.handleChangeSelectMultipleAdd("cc", e, this.selectMultipleCc)}
                                       onChangeDel={(e) => this.handleChangeSelectMultipleDel("cc", e, this.selectMultipleCc)}
                                       createType={"email"}
                    >
                        Cc
                    </SelectizeMultiple>
                </div>}

                {showBcc && <div className="line line-dest">
                    <SelectizeMultiple ref={this.selectMultipleBcc} items={selectItems} identifiant="bcc" valeur={bcc}
                                       errors={errors}
                                       onChangeAdd={(e) => this.handleChangeSelectMultipleAdd("bcc", e, this.selectMultipleBcc)}
                                       onChangeDel={(e) => this.handleChangeSelectMultipleDel("bcc", e, this.selectMultipleBcc)}
                                       createType={"email"}
                    >
                        Cci
                    </SelectizeMultiple>
                </div>}

                {from && <div className="line line-dest">
                    <div className="form-group">
                        <label>From</label>
                        <div>{from}</div>
                    </div>
                </div>}

                <div className="line line-subject">
                    <Input identifiant="subject" valeur={subject} errors={errors} onChange={this.handleChange}>Objet</Input>
                </div>

                <div className="line">
                    <Drop ref={this.inputFiles} identifiant="files" errors={errors} accept={"*"} maxFiles={5}
                          label="Téléverser des fichiers (max 5) (poids max 5Mb)" labelError="Erreur avec un/vos fichiers.">Documents</Drop>
                </div>

                {parseInt(theme) === 1 && <div className="line">
                    <Input identifiant="title" valeur={title} errors={errors} onChange={this.handleChange}>Titre du message</Input>
                    <div className="form-group" />
                </div>}

                <div className="line">
                    <Trumb identifiant={"message-" + (i++)} valeur={message.value} errors={errors} onChange={this.handleChangeTrumb}>Message</Trumb>
                </div>

                <div className="line line-btn-mails">
                    <div className="form-button">
                        <div>
                            <Button isSubmit={false} outline={true} type="default" onClick={this.handlePreview}>Prévisualisation</Button>
                            <Button isSubmit={false} type="warning" onClick={this.handleDraft}>Brouillon</Button>
                        </div>
                        <Button isSubmit={false} onClick={this.handleSubmit}>{TXT_CREATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}

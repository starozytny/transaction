import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Button, ButtonIcon }  from "@dashboardComponents/Tools/Button";
import { HelpBubble }          from "@dashboardComponents/Tools/HelpBubble";

import Validateur              from "@commonComponents/functions/validateur";
import Sort                    from "@commonComponents/functions/sort";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import helper                  from "./helper";

const URL_CREATE_ELEMENT     = "api_biens_create";
const URL_UPDATE_GROUP       = "api_biens_update";

const ARRAY_STRING_BIENS = ["Appartement", "Maison", "Parking/Box", "Terrain", "Boutique", "Bureau", "Château", "Immeuble", "Terrain + Maison", "Divers"];

function setValueEmptyIfNull (value) {
    return value ? value : ""
}

export function BienFormulaire ({ type, element, negotiators })
{
    let title = "Ajouter un bien";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouveau bien !"

    if(type === "update"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        title={title}
        context={type}
        url={url}

        codeTypeAd={element ? element.codeTypeAd : ""}
        codeTypeBien={element ? element.codeTypeBien : ""}
        libelle={element ? element.libelle : ""}
        codeTypeMandat={element ? element.codeTypeMandat : ""}
        negotiator={element ? element.negotiator.id : ""}

        areaTotal={element ? setValueEmptyIfNull(element.area.total) : ""}
        areaHabitable={element ? setValueEmptyIfNull(element.area.habitable) : ""}
        areaLand={element ? setValueEmptyIfNull(element.area.land) : ""}
        areaGarden={element ? setValueEmptyIfNull(element.area.garden) : ""}
        areaTerrace={element ? setValueEmptyIfNull(element.area.terrace) : ""}
        areaCave={element ? setValueEmptyIfNull(element.area.cave) : ""}
        areaBathroom={element ? setValueEmptyIfNull(element.area.bathroom) : ""}
        areaLiving={element ? setValueEmptyIfNull(element.area.living) : ""}
        areaDining={element ? setValueEmptyIfNull(element.area.dining) : ""}

        piece={element ? setValueEmptyIfNull(element.number.piece) : ""}
        room={element ? setValueEmptyIfNull(element.number.room) : ""}
        bathroom={element ? setValueEmptyIfNull(element.number.bathroom) : ""}
        wc={element ? setValueEmptyIfNull(element.number.wc) : ""}
        balcony={element ? setValueEmptyIfNull(element.number.balcony) : ""}
        parking={element ? setValueEmptyIfNull(element.number.parking) : ""}
        box={element ? setValueEmptyIfNull(element.number.box) : ""}

        messageSuccess={msg}

        negotiators={negotiators}
    />

    return <div className="main-content">{form}</div>
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codeTypeAd: props.codeTypeAd,
            codeTypeBien: props.codeTypeBien,
            libelle: props.libelle,
            codeTypeMandat: props.codeTypeMandat,
            negotiator: props.negotiator,

            areaTotal: props.areaTotal,
            areaHabitable: props.areaHabitable,
            areaLand: props.areaLand,
            areaGarden: props.areaGarden,
            areaTerrace: props.areaTerrace,
            areaCave: props.areaCave,
            areaBathroom: props.areaBathroom,
            areaLiving: props.areaLiving,
            areaDining: props.areaDining,

            piece: props.piece,
            room: props.room,
            bathroom: props.bathroom,
            wc: props.wc,
            balcony: props.balcony,
            parking: props.parking,
            box: props.box,

            contentHelpBubble: "",
            errors: [],
            step: 1
        }

        this.helpBubble = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenHelp = this.handleOpenHelp.bind(this);
    }

    handleChange = (e) => {
        const { libelle } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        this.setState({[name]: value});

        // PREREMPLIR le libellé
        if(name === "codeTypeBien" && libelle !== ARRAY_STRING_BIENS[value]
            && (ARRAY_STRING_BIENS.includes(libelle) || libelle === "")){
            this.setState({ libelle: ARRAY_STRING_BIENS[value] })
        }
    }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleNext = (stepClicked, stepInitial = null) => {
        const { codeTypeAd, codeTypeBien, libelle, codeTypeMandat, negotiator,
            areaTotal, piece } = this.state;

        let paramsToValidate = [];
        switch (stepClicked){
            case 3:
                paramsToValidate = [
                    {type: "text",      id: 'areaTotal',      value: areaTotal},
                    {type: "text",      id: 'piece',          value: piece}
                ];
                break;
            case 2:
                paramsToValidate = [
                    {type: "text",      id: 'codeTypeAd',     value: codeTypeAd},
                    {type: "text",      id: 'codeTypeBien',   value: codeTypeBien},
                    {type: "text",      id: 'libelle',        value: libelle},
                    {type: "text",      id: 'codeTypeMandat', value: codeTypeMandat},
                    {type: "text",      id: 'negotiator',     value: negotiator},
                    {type: "length",    id: 'libelle',        value: libelle, min: 0, max: 64},
                ];
                break;
            default:
                break;
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            this.setState({ step: stepInitial ? stepInitial : stepClicked })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;

        let self = this;
        Formulaire.loader(true);

        let formData = new FormData();
        formData.append("data", JSON.stringify(this.state));

        axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
            .then(function (response) {
                let data = response.data;
                toastr.info(messageSuccess);
                //message success + redirect to index
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
            .then(() => {
                Formulaire.loader(false);
            })
        ;
    }

    handleOpenHelp = (type) => {
        let content = "";
        switch (type) {
            default:
                content = "Un titre comme \"Appartement T1 centre ville 20m²\" est parfait pour le référencement\n" +
                          "et donc obtenir une meilleure visibilité de votre annonce sur les moteurs de recherches et plateformes.";
                break;
        }

        this.setState({ contentHelpBubble: content })
        this.helpBubble.current.handleOpen();
    }

    render () {
        const { negotiators } = this.props;
        const { step, errors, contentHelpBubble, codeTypeAd, codeTypeBien, libelle, codeTypeMandat, negotiator,
            areaTotal, areaHabitable, areaLand, areaGarden, areaTerrace, areaCave, areaBathroom, areaLiving, areaDining,
            piece, room, bathroom, wc, balcony, parking, box } = this.state;

        let steps = [
            {id: 1, label: "Informations globales"},
            {id: 2, label: "Details du bien"},
            {id: 3, label: "Localisation"},
            {id: 4, label: "Financier"},
            {id: 5, label: "Photos"},
            {id: 6, label: "Propriétaire"},
            {id: 7, label: "Publication"},
        ];

        let stepTitle = "Etape 1 : Informations globales";
        let stepsItems = [];
        {steps.forEach(el => {
            let active = "";
            if(el.id === step){
                active = " active";
                stepTitle = "Etape " + el.id + " : " + el.label;
            }
            stepsItems.push(<div className={"item" + active} key={el.id} onClick={() => this.handleNext(el.id, step)}>
                <span className="number">{el.id}</span>
                <span className="label">{el.label}</span>
            </div>)
        })}

        let typeAdItems = helper.getItems("ads");
        let typeBienItems = helper.getItems("biens");
        let typeMandatItems = helper.getItems("mandats");

        let negociateurs = []
        negotiators.sort(Sort.compareLastname)
        negotiators.forEach(ne => {
            negociateurs.push({ value: ne.id, label: "#" + ne.code + " - " + ne.fullname, identifiant: "neg-" + ne.id })
        })

        return <div className="page-default">
            <div className="page-col-1">
                <div className="comeback">
                    <Button type="reverse" element="a" onClick={Routing.generate('user_biens')}>Retour à la liste</Button>
                </div>
                <div className="body-col-1">
                    <div className="title-col-1">
                        <span>Etapes :</span>
                    </div>
                    <div className="content-col-1 steps">
                        {stepsItems}
                    </div>
                </div>
            </div>
            <div className="page-col-2">
                <div className="title-col-2">
                    <div className="tab-col-2">
                        <div className="item active">{stepTitle}</div>
                    </div>
                    <Button type="warning">Enregistrer le brouillon</Button>
                </div>
                <section>
                    <form className="form-bien" onSubmit={this.handleSubmit}>
                        <div className={"step-section" + (step === 1 ? " active" : "")}>
                            <div className="line special-line">
                                <Radiobox items={typeAdItems} identifiant="codeTypeAd" valeur={codeTypeAd} errors={errors} onChange={this.handleChange}>
                                    Type d'annonce
                                </Radiobox>
                            </div>

                            <div className="line special-line">
                                <Radiobox items={typeBienItems} identifiant="codeTypeBien" valeur={codeTypeBien} errors={errors} onChange={this.handleChange}>
                                    Type de bien
                                </Radiobox>
                            </div>

                            <div className="line special-line">
                                <Input identifiant="libelle" valeur={libelle} errors={errors} onChange={this.handleChange}
                                       placeholder="Exemple : Appartement T1 Centre ville (max 64 caractères)"
                                >
                                    <span>Libellé de l'annonce</span>
                                    <div className="input-label-help">
                                        <ButtonIcon icon="question" onClick={() => this.handleOpenHelp("libelle")}>Aide</ButtonIcon>
                                    </div>
                                </Input>
                            </div>

                            <div className="line special-line">
                                <Radiobox items={typeMandatItems} identifiant="codeTypeMandat" valeur={codeTypeMandat} errors={errors} onChange={this.handleChange}>
                                    Type de mandat
                                </Radiobox>
                            </div>

                            <div className="line line-2">
                                <SelectReactSelectize items={negociateurs} identifiant="negotiator" valeur={negotiator} errors={errors}
                                                      onChange={(e) => this.handleChangeSelect('negotiator', e)}>
                                    Négociateur
                                </SelectReactSelectize>
                            </div>

                            <div className="line line-buttons">
                                {/*<Button type="reverse">Etape précédente</Button>*/}
                                <div/>
                                <div className="btns-submit">
                                    <Button type="warning">Enregistrer le brouillon</Button>
                                    <Button onClick={() => this.handleNext( 2)}>Etape suivante</Button>
                                </div>
                            </div>
                        </div>

                        <div className={"step-section" + (step === 1 ? " active" : "")}>
                            <div className="line special-line">
                                <div className="form-group">
                                    <label>Surfaces (m²)</label>
                                </div>
                                <div className="line line-infinite">
                                    <Input type="number" step="any" min={0} identifiant="areaTotal" valeur={areaTotal} errors={errors} onChange={this.handleChange}>
                                        <span>Totale</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaHabitable" valeur={areaHabitable} errors={errors} onChange={this.handleChange}>
                                        <span>Habitable</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaLand" valeur={areaLand} errors={errors} onChange={this.handleChange}>
                                        <span>Terrain</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaGarden" valeur={areaGarden} errors={errors} onChange={this.handleChange}>
                                        <span>Jardin</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaTerrace" valeur={areaTerrace} errors={errors} onChange={this.handleChange}>
                                        <span>Terrasse</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaCave" valeur={areaCave} errors={errors} onChange={this.handleChange}>
                                        <span>Cave</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaBathroom" valeur={areaBathroom} errors={errors} onChange={this.handleChange}>
                                        <span>Salle de bain</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaLiving" valeur={areaLiving} errors={errors} onChange={this.handleChange}>
                                        <span>Salon</span>
                                    </Input>
                                    <Input type="number" step="any" min={0} identifiant="areaDining" valeur={areaDining} errors={errors} onChange={this.handleChange}>
                                        <span>Salle à manger</span>
                                    </Input>
                                </div>
                            </div>

                            <div className="line special-line">
                                <div className="form-group">
                                    <label>Nombre de ...</label>
                                </div>
                                <div className="line line-infinite">
                                    <Input type="number" min={0} identifiant="piece" valeur={piece} errors={errors} onChange={this.handleChange}>
                                        <span>Pièces</span>
                                    </Input>
                                    <Input type="number" min={0} identifiant="room" valeur={room} errors={errors} onChange={this.handleChange}>
                                        <span>Chambres</span>
                                    </Input>
                                    <Input type="number" min={0} identifiant="bathroom" valeur={bathroom} errors={errors} onChange={this.handleChange}>
                                        <span>Salles de bain</span>
                                    </Input>
                                    <Input type="number" min={0} identifiant="wc" valeur={wc} errors={errors} onChange={this.handleChange}>
                                        <span>WC</span>
                                    </Input>
                                    <Input type="number" min={0} identifiant="balcony" valeur={balcony} errors={errors} onChange={this.handleChange}>
                                        <span>Blacons</span>
                                    </Input>
                                    <Input type="number" min={0} identifiant="parking" valeur={parking} errors={errors} onChange={this.handleChange}>
                                        <span>Parkings</span>
                                    </Input>
                                    <Input type="number" min={0} identifiant="box" valeur={box} errors={errors} onChange={this.handleChange}>
                                        <span>Boxes</span>
                                    </Input>
                                </div>
                            </div>

                            <div className="line line-buttons">
                                <Button type="reverse">Etape précédente</Button>
                                <div/>
                                <div className="btns-submit">
                                    <Button type="warning">Enregistrer le brouillon</Button>
                                    <Button onClick={() => this.handleNext( 3)}>Etape suivante</Button>
                                </div>
                            </div>

                            <div className="line">
                                <Button isSubmit={true}>Enregistrer le bien</Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Aide</HelpBubble>
        </div>
    }
}
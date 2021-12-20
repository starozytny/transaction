import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Button, ButtonIcon }  from "@dashboardComponents/Tools/Button";
import { HelpBubble }          from "@dashboardComponents/Tools/HelpBubble";
import { DatePick }            from "@dashboardComponents/Tools/DatePicker";

import Validateur              from "@commonComponents/functions/validateur";
import Sort                    from "@commonComponents/functions/sort";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import helper                  from "./helper";

const URL_CREATE_ELEMENT     = "api_biens_create";
const URL_UPDATE_GROUP       = "api_biens_update";

const ARRAY_STRING_BIENS = ["Appartement", "Maison", "Parking/Box", "Terrain", "Boutique", "Bureau", "Château", "Immeuble", "Terrain + Maison", "Divers"];

function setValueEmptyIfNull (parentValue, value) {
    return parentValue ? value : ""
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

    let area = element ? element.area : null;
    let number = element ? element.number : null;
    let feature = element ? element.feature : null;
    let advantage = element ? element.advantage : null;
    let diag = element ? element.diag : null;

    let form = <Form
        title={title}
        context={type}
        url={url}

        codeTypeAd={element ? element.codeTypeAd : ""}
        codeTypeBien={element ? element.codeTypeBien : ""}
        libelle={element ? element.libelle : ""}
        codeTypeMandat={element ? element.codeTypeMandat : ""}
        negotiator={element ? element.negotiator.id : ""}

        areaTotal={element ? setValueEmptyIfNull(area, area.total) : ""}
        areaHabitable={element ? setValueEmptyIfNull(area, area.habitable) : ""}
        areaLand={element ? setValueEmptyIfNull(area, area.land) : ""}
        areaGarden={element ? setValueEmptyIfNull(area, area.garden) : ""}
        areaTerrace={element ? setValueEmptyIfNull(area, area.terrace) : ""}
        areaCave={element ? setValueEmptyIfNull(area, area.cave) : ""}
        areaBathroom={element ? setValueEmptyIfNull(area, area.bathroom) : ""}
        areaLiving={element ? setValueEmptyIfNull(area, area.living) : ""}
        areaDining={element ? setValueEmptyIfNull(area, area.dining) : ""}

        piece={element ? setValueEmptyIfNull(number, number.piece) : ""}
        room={element ? setValueEmptyIfNull(number, number.room) : ""}
        bathroom={element ? setValueEmptyIfNull(number, number.bathroom) : ""}
        wc={element ? setValueEmptyIfNull(number, number.wc) : ""}
        balcony={element ? setValueEmptyIfNull(number, number.balcony) : ""}
        parking={element ? setValueEmptyIfNull(number, number.parking) : ""}
        box={element ? setValueEmptyIfNull(number, number.box) : ""}

        dispoAt={element ? (setValueEmptyIfNull(feature, feature.dispoAtJavascript) !== "" ? new Date(feature.dispoAtJavascript) : "" ) : ""}
        buildAt={element ? setValueEmptyIfNull(feature, feature.buildAt) : ""}
        isMeuble={element ? setValueEmptyIfNull(feature, feature.isMeuble) : 99}
        isNew={element ? setValueEmptyIfNull(feature, feature.isNew) : 99}
        floor={element ? setValueEmptyIfNull(feature, feature.floor) : ""}
        nbFloor={element ? setValueEmptyIfNull(feature, feature.nbFloor) : ""}
        codeHeater0={element ? setValueEmptyIfNull(feature, feature.codeHeater0) : ""}
        codeHeater={element ? setValueEmptyIfNull(feature, feature.codeHeater) : ""}
        codeKitchen={element ? setValueEmptyIfNull(feature, feature.codeKitchen) : ""}
        isWcSeparate={element ? setValueEmptyIfNull(feature, feature.isWcSeparate) : 99}
        codeWater={element ? setValueEmptyIfNull(feature, feature.codeWater) : ""}
        exposition={element ? setValueEmptyIfNull(feature, feature.exposition) : 99}

        hasGarden={element ? setValueEmptyIfNull(advantage, advantage.hasGarden) : 99}
        hasTerrace={element ? setValueEmptyIfNull(advantage, advantage.hasTerrace) : 99}
        hasPool={element ? setValueEmptyIfNull(advantage, advantage.hasPool) : 99}
        hasCave={element ? setValueEmptyIfNull(advantage, advantage.hasCave) : 99}
        hasDigicode={element ? setValueEmptyIfNull(advantage, advantage.hasDigicode) : 99}
        hasInterphone={element ? setValueEmptyIfNull(advantage, advantage.hasInterphone) : 99}
        hasGuardian={element ? setValueEmptyIfNull(advantage, advantage.hasGuardian) : 99}
        hasAlarme={element ? setValueEmptyIfNull(advantage, advantage.hasAlarme) : 99}
        hasLift={element ? setValueEmptyIfNull(advantage, advantage.hasLift) : 99}
        hasClim={element ? setValueEmptyIfNull(advantage, advantage.hasClim) : 99}
        hasCalme={element ? setValueEmptyIfNull(advantage, advantage.hasCalme) : 99}
        hasInternet={element ? setValueEmptyIfNull(advantage, advantage.hasInternet) : 99}
        hasHandi={element ? setValueEmptyIfNull(advantage, advantage.hasHandi) : 99}
        hasFibre={element ? setValueEmptyIfNull(advantage, advantage.hasFibre) : 99}
        situation={element ? setValueEmptyIfNull(advantage, advantage.situation) : ""}
        sousType={element ? setValueEmptyIfNull(advantage, advantage.sousType) : ""}
        sol={element ? setValueEmptyIfNull(advantage, advantage.sol) : ""}

        beforeJuly={element ? setValueEmptyIfNull(diag, diag.beforeJuly) : 1}
        isVirgin={element ? setValueEmptyIfNull(diag, diag.isVirgin) : 0}
        isSend={element ? setValueEmptyIfNull(diag, diag.isSend) : 0}
        createdAtDpe={element ?  (setValueEmptyIfNull(feature, feature.createdAtDpeJavascript) !== "" ? new Date(feature.createdAtDpeJavascript) : "" ) : ""}
        referenceDpe={element ? setValueEmptyIfNull(diag, diag.referenceDpe) : ""}
        dpeLetter={element ? setValueEmptyIfNull(diag, diag.dpeLetter) : ""}
        gesLetter={element ? setValueEmptyIfNull(diag, diag.gesLetter) : ""}
        dpeValue={element ? setValueEmptyIfNull(diag, diag.dpeValue) : ""}
        gesValue={element ? setValueEmptyIfNull(diag, diag.gesValue) : ""}
        minAnnual={element ? setValueEmptyIfNull(diag, diag.minAnnual) : ""}
        maxAnnual={element ? setValueEmptyIfNull(diag, diag.maxAnnual) : ""}

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

            dispoAt: props.dispoAt,
            buildAt: props.buildAt,
            isMeuble: props.isMeuble,
            isNew: props.isNew,
            floor: props.floor,
            nbFloor: props.nbFloor,
            codeHeater0: props.codeHeater0,
            codeHeater: props.codeHeater,
            codeKitchen: props.codeKitchen,
            isWcSeparate: props.isWcSeparate,
            codeWater: props.codeWater,
            exposition: props.exposition,

            hasGarden: props.hasGarden,
            hasTerrace: props.hasTerrace,
            hasPool: props.hasPool,
            hasCave: props.hasCave,
            hasDigicode: props.hasDigicode,
            hasInterphone: props.hasInterphone,
            hasGuardian: props.hasGuardian,
            hasAlarme: props.hasAlarme,
            hasLift: props.hasLift,
            hasClim: props.hasClim,
            hasCalme: props.hasCalme,
            hasInternet: props.hasInternet,
            hasHandi: props.hasHandi,
            hasFibre: props.hasFibre,
            situation: props.situation,
            sousType: props.sousType,
            sol: props.sol,

            beforeJuly: props.beforeJuly,
            isVirgin: props.isVirgin,
            isSend: props.isSend,
            createdAtDpe: props.createdAtDpe,
            referenceDpe: props.referenceDpe,
            dpeLetter: props.dpeLetter,
            gesLetter: props.gesLetter,
            dpeValue: props.dpeValue,
            gesValue: props.gesValue,
            minAnnual: props.minAnnual,
            maxAnnual: props.maxAnnual,

            contentHelpBubble: "",
            errors: [],
            step: 3
        }

        this.helpBubble = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
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

    handleChangeDate = (name, e) => { this.setState({ [name]: e !== null ? e : "" }) }

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
            piece, room, bathroom, wc, balcony, parking, box,
            dispoAt, buildAt, isMeuble, isNew, floor, nbFloor, codeHeater, codeKitchen, isWcSeparate, codeWater, exposition, codeHeater0,
            hasGarden, hasTerrace, hasPool, hasCave, hasDigicode, hasInterphone, hasGuardian, hasAlarme, hasLift, hasClim, hasCalme, hasInternet,
            hasHandi, hasFibre, situation, sousType, sol,
            beforeJuly, isVirgin, isSend, createdAtDpe, referenceDpe, dpeLetter, gesLetter, dpeValue, gesValue, minAnnual, maxAnnual } = this.state;

        let steps = [
            {id: 1, label: "Informations globales"},
            {id: 2, label: "Details du bien (1/2)"},
            {id: 3, label: "Details du bien (2/2)"},
            {id: 4, label: "Localisation"},
            {id: 5, label: "Financier"},
            {id: 6, label: "Photos"},
            {id: 7, label: "Propriétaire"},
            {id: 8, label: "Publication"},
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
        let expositionItems = helper.getItems("expositions");
        let chauffage0Items = helper.getItems("chauffages-0");
        let chauffage1Items = helper.getItems("chauffages-1");
        let cuisineItems = helper.getItems("cuisines");
        let waterItems = helper.getItems("water");
        let soustypeItems = helper.getItems("water");
        let solItems = helper.getItems("water");

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

                        <div className={"step-section" + (step === 2 ? " active" : "")}>
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

                            <div className="line special-line">
                                <div className="form-group">
                                    <label>Caractéristique</label>
                                </div>
                                <div className="line line-2">
                                    <DatePick identifiant="dispoAt" valeur={dispoAt} errors={errors}
                                              onChange={(e) => this.handleChangeDate("dispoAt", e)}>
                                        Date disponible
                                    </DatePick>
                                    <Input type="number" min={1200} identifiant="buildAt" valeur={buildAt} errors={errors} onChange={this.handleChange}>
                                        <span>Année de construction</span>
                                    </Input>
                                </div>

                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 0)} identifiant="isMeuble" valeur={isMeuble} errors={errors} onChange={this.handleChange}>
                                        Meublé ?
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 1)} identifiant="isNew" valeur={isNew} errors={errors} onChange={this.handleChange}>
                                        Refait à neuf ?
                                    </Radiobox>
                                </div>
                                <div className="line line-2">
                                    <Input identifiant="floor" valeur={floor} errors={errors} onChange={this.handleChange}>
                                        <span>Etage</span>
                                    </Input>
                                    <Input type="number" min={0} identifiant="nbFloor" valeur={nbFloor} errors={errors} onChange={this.handleChange}>
                                        <span>Nombre d'étages</span>
                                    </Input>
                                </div>
                                <div className="line line-2">
                                    <SelectReactSelectize items={chauffage0Items} identifiant="codeHeater0" valeur={codeHeater0} errors={errors}
                                                          onChange={(e) => this.handleChangeSelect('codeHeater0', e)}>
                                        Type de chauffage (1/2)
                                    </SelectReactSelectize>
                                    <SelectReactSelectize items={chauffage1Items} identifiant="codeHeater" valeur={codeHeater} errors={errors}
                                                          onChange={(e) => this.handleChangeSelect('codeHeater', e)}>
                                        Type de chauffage (2/2)
                                    </SelectReactSelectize>
                                </div>
                                <div className="line line-2">
                                    <SelectReactSelectize items={cuisineItems} identifiant="codeKitchen" valeur={codeKitchen} errors={errors}
                                                          onChange={(e) => this.handleChangeSelect('codeKitchen', e)}>
                                        Type de cuisine
                                    </SelectReactSelectize>
                                    <SelectReactSelectize items={waterItems} identifiant="codeWater" valeur={codeWater} errors={errors}
                                                          onChange={(e) => this.handleChangeSelect('codeWater', e)}>
                                        Type d'eau chaude
                                    </SelectReactSelectize>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 2)} identifiant="isWcSeparate" valeur={isWcSeparate} errors={errors} onChange={this.handleChange}>
                                        WC séparé ?
                                    </Radiobox>
                                    <div className="form-group" />
                                </div>
                                <div className="line line-infinite">
                                    <Radiobox items={expositionItems} identifiant="exposition" valeur={exposition} errors={errors} onChange={this.handleChange}>
                                        Exposition
                                    </Radiobox>
                                </div>

                                <div className="line line-buttons">
                                    <Button type="reverse">Etape précédente</Button>
                                    <div/>
                                    <div className="btns-submit">
                                        <Button type="warning">Enregistrer le brouillon</Button>
                                        <Button onClick={() => this.handleNext( 3)}>Etape suivante</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={"step-section" + (step === 3 ? " active" : "")}>
                            <div className="line special-line">
                                <div className="form-group">
                                    <label>Les avantages</label>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 3)} identifiant="hasGarden" valeur={hasGarden} errors={errors} onChange={this.handleChange}>
                                        Jardin
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 4)} identifiant="hasTerrace" valeur={hasTerrace} errors={errors} onChange={this.handleChange}>
                                        Terrasse
                                    </Radiobox>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 5)} identifiant="hasPool" valeur={hasPool} errors={errors} onChange={this.handleChange}>
                                        Piscine
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 6)} identifiant="hasCave" valeur={hasCave} errors={errors} onChange={this.handleChange}>
                                        Cave
                                    </Radiobox>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 7)} identifiant="hasDigicode" valeur={hasDigicode} errors={errors} onChange={this.handleChange}>
                                        Digicode
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 8)} identifiant="hasInterphone" valeur={hasInterphone} errors={errors} onChange={this.handleChange}>
                                        Interphone
                                    </Radiobox>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 9)} identifiant="hasGuardian" valeur={hasGuardian} errors={errors} onChange={this.handleChange}>
                                        Gardien
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 10)} identifiant="hasAlarme" valeur={hasAlarme} errors={errors} onChange={this.handleChange}>
                                        Alarme
                                    </Radiobox>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 11)} identifiant="hasLift" valeur={hasLift} errors={errors} onChange={this.handleChange}>
                                        Ascenseur
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 12)} identifiant="hasClim" valeur={hasClim} errors={errors} onChange={this.handleChange}>
                                        Climatisation
                                    </Radiobox>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 13)} identifiant="hasCalme" valeur={hasCalme} errors={errors} onChange={this.handleChange}>
                                        Calme
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 14)} identifiant="hasInternet" valeur={hasInternet} errors={errors} onChange={this.handleChange}>
                                        Internet
                                    </Radiobox>
                                </div>
                                <div className="line line-2">
                                    <Radiobox items={helper.getItems("answers", 15)} identifiant="hasHandi" valeur={hasHandi} errors={errors} onChange={this.handleChange}>
                                        Aménagement pour handicapés
                                    </Radiobox>
                                    <Radiobox items={helper.getItems("answers", 16)} identifiant="hasFibre" valeur={hasFibre} errors={errors} onChange={this.handleChange}>
                                        Internet avec la fibre
                                    </Radiobox>
                                </div>

                                <div className="line line-2">
                                    <Input identifiant="situation" valeur={situation} errors={errors} onChange={this.handleChange}>
                                        <span>Situation</span>
                                    </Input>
                                    <SelectReactSelectize items={soustypeItems} identifiant="sousType" valeur={sousType} errors={errors}
                                                          onChange={(e) => this.handleChangeSelect('codeKitchen', e)}>
                                        Sous type de bien
                                    </SelectReactSelectize>
                                </div>

                                <div className="line line-2">
                                    <SelectReactSelectize items={solItems} identifiant="sol" valeur={sol} errors={errors}
                                                          onChange={(e) => this.handleChangeSelect('codeKitchen', e)}>
                                        Type de sol
                                    </SelectReactSelectize>
                                    <div className="form-group" />
                                </div>
                            </div>

                            <div className={"step-section" + (step === 3 ? " active" : "")}>
                                <div className="line special-line">
                                    <div className="form-group">
                                        <label>Diagnostique</label>
                                    </div>

                                    <div className="line line-3">
                                        <Radiobox items={helper.getItems("answers", 17)} identifiant="beforeJuly" valeur={beforeJuly} errors={errors} onChange={this.handleChange}>
                                            DPE avant le 1 juil. 2021
                                        </Radiobox>
                                        {parseInt(beforeJuly) !== 1 && <>
                                            <Radiobox items={helper.getItems("answers", 18)} identifiant="isVirgin" valeur={isVirgin} errors={errors} onChange={this.handleChange}>
                                                DPE vierge
                                            </Radiobox>
                                            <Radiobox items={helper.getItems("answers", 19)} identifiant="isSend" valeur={isSend} errors={errors} onChange={this.handleChange}>
                                                DPE non soumis
                                            </Radiobox>
                                        </>}
                                    </div>

                                    <div className="line line-2">
                                        <DatePick identifiant="createdAtDpe" valeur={createdAtDpe} errors={errors}
                                                  onChange={(e) => this.handleChangeDate("createdAtDpe", e)}>
                                            Date de réalisation du DPE
                                        </DatePick>
                                        <Input type="number" min={1200} identifiant="referenceDpe" valeur={referenceDpe} errors={errors} onChange={this.handleChange}>
                                            <span>Année de référence conso DPE</span>
                                        </Input>
                                    </div>

                                    <div className="line line-2">
                                        <Input type="number" step="any" min={0} identifiant="dpeValue" valeur={dpeValue} errors={errors} onChange={this.handleChange}>
                                            <span>en KWh/m² an</span>
                                        </Input>
                                        <Input type="number" step="any" min={0} identifiant="dpeLetter" valeur={gesValue} errors={errors} onChange={this.handleChange}>
                                            <span>en Kg/co² an</span>
                                        </Input>
                                    </div>

                                    <div className="line line-2">
                                        <Input type="number" step="any" min={0} identifiant="minAnnual" valeur={minAnnual} errors={errors} onChange={this.handleChange}>
                                            <span>Estimation des coûts annuels minimun</span>
                                        </Input>
                                        <Input type="number" step="any" min={0} identifiant="maxAnnuel" valeur={maxAnnual} errors={errors} onChange={this.handleChange}>
                                            <span>Estimation des coûts annuels maximum</span>
                                        </Input>
                                    </div>
                                </div>
                            </div>

                            <div className="line line-buttons">
                                <Button type="reverse">Etape précédente</Button>
                                <div/>
                                <div className="btns-submit">
                                    <Button type="warning">Enregistrer le brouillon</Button>
                                    <Button onClick={() => this.handleNext( 4)}>Etape suivante</Button>
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
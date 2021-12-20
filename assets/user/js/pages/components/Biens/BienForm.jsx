import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }              from "@dashboardComponents/Tools/Button";
import { HelpBubble }          from "@dashboardComponents/Tools/HelpBubble";

import Validateur              from "@commonComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

import { Step1 }               from "@userPages/components/Biens/Steps/Step1";
import { Step2 }               from "@userPages/components/Biens/Steps/Step2";
import { Step3 }               from "@userPages/components/Biens/Steps/Step3";
import { Step4 }               from "@userPages/components/Biens/Steps/Step4";
import Helper from "@commonComponents/functions/helper";

const URL_CREATE_ELEMENT     = "api_biens_create";
const URL_UPDATE_GROUP       = "api_biens_update";

const ARRAY_STRING_BIENS = ["Appartement", "Maison", "Parking/Box", "Terrain", "Boutique", "Bureau", "Château", "Immeuble", "Terrain + Maison", "Divers"];

let arrayZipcodeSave = [];

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
    let localisation = element ? element.localisation : null;

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

        address={element ? setValueEmptyIfNull(localisation, localisation.address) : ""}
        hideAddress={element ? setValueEmptyIfNull(localisation, localisation.hideAddress) : 0}
        zipcode={element ? setValueEmptyIfNull(localisation, localisation.zipcode) : ""}
        city={element ? setValueEmptyIfNull(localisation, localisation.city) : ""}
        country={element ? setValueEmptyIfNull(localisation, localisation.country) : ""}
        departement={element ? setValueEmptyIfNull(localisation, localisation.departement) : ""}
        quartier={element ? setValueEmptyIfNull(localisation, localisation.quartier) : ""}
        lat={element ? setValueEmptyIfNull(localisation, localisation.lat) : ""}
        lon={element ? setValueEmptyIfNull(localisation, localisation.lon) : ""}
        hideMap={element ? setValueEmptyIfNull(localisation, localisation.hideMap) : 0}

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

            address: props.address,
            hideAddress: props.hideAddress,
            zipcode: props.zipcode,
            city: props.city,
            country: props.country,
            departement: props.departement,
            quartier: props.quartier,
            lat: props.lat,
            lon: props.lon,
            hideMap: props.hideMap,

            contentHelpBubble: "",
            arrayPostalCode: [],
            errors: [],
            step: 4
        }

        this.helpBubble = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenHelp = this.handleOpenHelp.bind(this);
    }

    componentDidMount = () => { Helper.getPostalCodes(this); }

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

    handleChangeZipcode = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode ? arrayPostalCode : arrayZipcodeSave)
    }

    handleNext = (stepClicked, stepInitial = null) => {
        const { codeTypeAd, codeTypeBien, libelle, codeTypeMandat, negotiator,
            areaTotal, piece } = this.state;

        let paramsToValidate = [];
        if(stepInitial == null){
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
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate);

        Helper.toTop();
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            this.setState({ step: stepClicked })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;

        let self = this;
        Formulaire.loader(true);

        let formData = new FormData();
        formData.append("data", JSON.stringify(this.state));

        arrayZipcodeSave = this.state.arrayPostalCode;
        delete this.state.arrayPostalCode;

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
        const { step, contentHelpBubble } = this.state;

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

                        <Step1 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                               onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate}
                               negotiators={negotiators} />

                        <Step2 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                               onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate} />

                        <Step3 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                               onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate} />

                        <Step4 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                               onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate}
                               onChangeZipcode={this.handleChangeZipcode} />

                    </form>
                </section>
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Aide</HelpBubble>
        </div>
    }
}
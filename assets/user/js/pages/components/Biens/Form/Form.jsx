import React, { Component } from "react";

import axios    from "axios";
import toastr   from "toastr";
import { uid }  from 'uid';
import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import helper           from "@userPages/components/Biens/helper";
import Helper           from "@commonComponents/functions/helper";
import Validateur       from "@commonComponents/functions/validateur";
import Sort             from "@commonComponents/functions/sort";
import Formulaire       from "@dashboardComponents/functions/Formulaire";
import DataState        from "./data";

import { HelpBubble }   from "@dashboardComponents/Tools/HelpBubble";
import { Button }       from "@dashboardComponents/Tools/Button";
import { Aside }        from "@dashboardComponents/Tools/Aside";

import { Step1 }        from "@userPages/components/Biens/Steps/Step1";
import { Step2 }        from "@userPages/components/Biens/Steps/Step2";
import { Step3 }        from "@userPages/components/Biens/Steps/Step3";
import { Step4 }        from "@userPages/components/Biens/Steps/Step4";
import { Step5 }        from "@userPages/components/Biens/Steps/Step5";
import { Step6 }        from "@userPages/components/Biens/Steps/Step6";
import { Step6Vente }   from "@userPages/components/Biens/Steps/Step6Vente";
import { Step7 }        from "@userPages/components/Biens/Steps/Step7";
import { Step8 }        from "@userPages/components/Biens/Steps/Step8";
import { Step9 }        from "@userPages/components/Biens/Steps/Step9";

import { Owners}        from "@dashboardPages/components/Immo/Owners/Owners";

let arrayZipcodeSave = [];
let arrayOwnersSave = [];
let initRank = null;

function getValueFloat(value){
    return value !== "" ? parseFloat(value) : 0;
}

function consequenceValueToBoolean(self, name, value, compareName, compareValue, toName, booleanValue=99) {
    if(name === compareName){
        if(value > parseFloat(compareValue)){
            self.setState({ [toName]: 1 })
        }else{
            self.setState({ [toName]: booleanValue })
        }
    }
}

function consequenceValueToRooms(self, name, value, rooms, compareName, codeTypeRoom, elStep) {
    if(name === compareName){
        let iteration = value !== "" ? parseInt(value) : 0;

        let nRooms = [];
        let total = 0;
        rooms.forEach(ro => {
            if(ro.typeRoom === codeTypeRoom){
                total++;
            }

            if(!ro.isGenerique){
                nRooms.push(ro);
            }

            if(ro.isGenerique && ro.typeRoom !== codeTypeRoom){
                nRooms.push(ro);
            }
        })
        iteration = iteration - total;

         rooms.filter(r => {return (r.isGenerique !== false && r.isGenerique !== undefined) || r.typeRoom !== codeTypeRoom});
        for(let i = 0 ; i < (iteration > 0 ? iteration : 0) ; i++){
            let newRoom = elStep.handleAddGeneriqueRoom(null, codeTypeRoom);
            nRooms.push(newRoom)
        }

        self.setState({ rooms: nRooms })
    }
}

function calculateFinancial(self, name, value, codeTypeAd,
                            price, notaire, honoraireTtc, honorairePourcentage, provisionCharges, provisionOrdures,
                            typeCalcul, tva, honoraireBail)
{
    let nPrice      = name === "price" ? value : price;
    let nNotaire    = name === "notaire" ? value : notaire;
    let nHonoTtc    = name === "honoraireTtc" ? value : honoraireTtc;
    let nHonoPour   = name === "honorairePourcentage" ? value : honorairePourcentage;
    let nProvChar   = name === "provisionCharges" ? value : provisionCharges;
    let nProvOrd    = name === "provisionOrdures" ? value : provisionOrdures;
    let nTva        = name === "tva" ? value : tva;
    let nHonoBail   = name === "honoraireBail" ? value : honoraireBail;
    let nTypeCalcul = name === "typeCalcul" ? value : typeCalcul;

    if(parseInt(codeTypeAd) !== 1){
        let nPriceHoAcq = getValueFloat(nPrice) + getValueFloat(nNotaire);

        if(name === "price" || name === "honorairePourcentage"){
            nHonoTtc = (getValueFloat(nPrice) * getValueFloat(nHonoPour)) / 100
            self.setState({ honoraireTtc: nHonoTtc })
        }

        if(name === "honoraireTtc"){
            nHonoPour = (getValueFloat(nHonoTtc)/getValueFloat(nPrice)) * 100;
            self.setState({ honorairePourcentage: nHonoPour })
        }

        let totalGeneral = getValueFloat(nPrice) + getValueFloat(nNotaire) + getValueFloat(nHonoTtc);
        self.setState({ totalGeneral: totalGeneral, priceHorsAcquereur: nPriceHoAcq })
    }else{
        let totalTerme, totalGeneral;
        switch (nTypeCalcul){
            case 2:
                totalTerme = getValueFloat(nPrice) + getValueFloat(nProvChar) + getValueFloat(nTva) + getValueFloat(nProvOrd);
                break;
            case 1:
                totalTerme = getValueFloat(nPrice) + getValueFloat(nProvChar) + getValueFloat(nTva);
                break;
            default:
                totalTerme = getValueFloat(nPrice) + getValueFloat(nProvChar) + getValueFloat(nProvOrd);
                break;
        }

        totalGeneral = totalTerme + getValueFloat(nHonoTtc) + getValueFloat(nHonoBail);

        self.setState({ totalTerme, totalGeneral })
    }
}

function getBase64(file, self, rank) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        self.setState({ photos: [...self.state.photos, ...[{
            uid: uid(),
            file: reader.result,
            name: file.name,
            legend: "",
            size: file.size,
            rank: rank,
            is64: true,
            isTrash: false
        }]] })
    };
    reader.onerror = function (error) {
        toastr.error('Error: ', error);
    };
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = DataState.getDataState(props);

        this.helpBubble = React.createRef();
        this.aside0 = React.createRef(); //image
        this.aside1 = React.createRef(); //owner
        this.aside3 = React.createRef(); //piece
        this.owner = React.createRef();
        this.rooms = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeLegend = this.handleChangeLegend.bind(this);
        this.handleChangeGeo = this.handleChangeGeo.bind(this);
        this.handleGenerateContent = this.handleGenerateContent.bind(this);

        this.handleSwitchTrashFile = this.handleSwitchTrashFile.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleOpenAside = this.handleOpenAside.bind(this);
        this.handleSaveLegend = this.handleSaveLegend.bind(this);
        this.handleSelectOwner = this.handleSelectOwner.bind(this);
        this.handleSelectRooms = this.handleSelectRooms.bind(this);

        this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenHelp = this.handleOpenHelp.bind(this);
    }

    componentDidMount = () => { Helper.getPostalCodes(this); }

    handleChange = (e) => {
        const { codeTypeAd, rooms, price, notaire, honoraireTtc, honorairePourcentage,
            provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        consequenceValueToBoolean(this, name, value, "areaGarden",  0, "hasGarden");
        consequenceValueToBoolean(this, name, value, "areaTerrace", 0, "hasTerrace");
        consequenceValueToBoolean(this, name, value, "areaCave",    0, "hasCave");

        let elStep = this.rooms.current;
        consequenceValueToRooms(this, name, value, rooms, "room",       4, elStep);
        consequenceValueToRooms(this, name, value, rooms, "bathroom",   9, elStep);
        consequenceValueToRooms(this, name, value, rooms, "wc",         12, elStep);
        consequenceValueToRooms(this, name, value, rooms, "balcony",    1, elStep);
        consequenceValueToRooms(this, name, value, rooms, "box",        2, elStep);

        calculateFinancial(this, name, value, codeTypeAd, price, notaire, honoraireTtc, honorairePourcentage,
            provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail);

        this.setState({[name]: value});
    }

    handleChangeSelect = (name, e) => {
        const { codeTypeAd, price, notaire, honoraireTtc, honorairePourcentage,
            provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail } = this.state;

        let value = e !== undefined ? e.value : "";

        if(name === "typeCalcul"){
            calculateFinancial(this, name, value, codeTypeAd, price, notaire, honoraireTtc, honorairePourcentage,
                provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail);
        }

        this.setState({ [name]: value })
    }

    handleChangeGeo = () => {
        const { address, zipcode, city } = this.state;

        let adr = address.replaceAll(" ", "+") + "+" + zipcode.replaceAll(" ", "+") + "+" + city.replaceAll(" ", "+");

        if(address !== "" && zipcode !== "" && city !== ""){
            const self = this;
            Formulaire.loader(true);
            axios({ method: "GET", url: 'https://api-adresse.data.gouv.fr/search/?q=' + adr + '&format=json&limit=1', data:{} })
                .then(function (response) {
                    let data = response.data;
                    let lat = data.features.length !== 0 ? data.features[0].geometry.coordinates[1] : "";
                    let lon = data.features.length !== 0 ? data.features[0].geometry.coordinates[0] : "";
                    self.setState({ lat, lon })
                })
                .then(function (){
                    Formulaire.loader(false)
                })
            ;
        }
    }

    handleChangeLegend = (e, el) => {
        el.legend = e.currentTarget.value;
        this.setState({ photo: el })
    }

    handleChangeFile = (e) => {
        const { photos } = this.state;

        let files = e.target.files;
        let self = this;

        let rank = 1;
        photos.forEach(p => {
            if(p.isTrash !== true){
                rank++;
            }
        })
        if(files){
            Array.prototype.forEach.call(files, (file) => {
                if(rank <= 20){
                    if(file.size > 1048576){
                        toastr.error("Le fichier est trop gros.")
                    }else{
                        if (/\.(jpe?g|png|gif)$/i.test(file.name)){
                            getBase64(file, self, rank);
                            rank++;
                        }
                    }
                }else{
                    toastr.error("Vous avez atteint la limite max de photos.")
                }
            })
        }
    }

    handleChangeDate = (name, e) => { this.setState({ [name]: e !== null ? e : "" }) }

    handleChangeZipcode = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode ? arrayPostalCode : arrayZipcodeSave)
    }

    handleGenerateContent = (type) => {
        console.log(this.state)
        if(type === "simple"){
            this.setState({ contentSimple: helper.setContentSimple(this) })
        }else{
            this.setState({ contentFull: helper.setContentFull(this) })
        }
    }

    handleNext = (stepClicked, stepInitial = null, fromMenu = false) => {
        const { codeTypeAd, codeTypeBien, libelle, codeTypeMandat, negotiator,
            areaTotal, piece } = this.state;

        let paramsToValidate = [];
        if(stepInitial === null || fromMenu === true){
            let stepValue = fromMenu ? stepInitial + 1 : stepClicked;
            switch (stepValue){
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
                        {type: "text",      id: 'negotiator',     value: negotiator}
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
            this.setState({ errors: [], step: stepClicked })
        }
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

    handleSwitchTrashFile = (el) => {
        const { photos } = this.state;

        let nPhotos = [], rank = 1;
        photos.sort(Sort.compareRank);
        photos.forEach(elem => {
            if(elem.uid === el.uid){
                elem.isTrash = !elem.isTrash;
            }

            elem.rank = rank;
            if(elem.isTrash !== true){
                rank++;
            }
            nPhotos.push(elem)
        })

        this.setState({ photos: nPhotos })
    }

    handleDragStart = (e, rank) => { initRank = rank; }

    handleDragLeave = (e) => {
        let elements = document.querySelectorAll(".item-drag");

        elements.forEach(el => {
            if(el !== e.currentTarget){
                el.classList.remove("grab-over");
            }else{
                e.currentTarget.classList.add("grab-over");
            }
        })


        e.preventDefault()
    }

    /**
     * @param e
     * @param rank - où l'élément va être drop
     */
    handleDrop = (e, rank) => {
        const { photos } = this.state;

        e.currentTarget.classList.remove("grab-over");

        let nPhotos = [];
        photos.forEach(elem => {
            if(elem.rank === rank){
                elem.rank = initRank;
            }else if(elem.rank === initRank){
                elem.rank = rank;
            }

            nPhotos.push(elem)
        })

        this.setState({ photos: nPhotos })
    }

    handleOpenAside = (type, el) => {
        switch (type) {
            case "room":
                if(!el){
                    this.rooms.current.handleUpdate();
                }
                this.aside3.current.handleOpen(el ? "Modifier " + el.name : "Ajouter une pièce");
                break;
            case "owner-select":
                this.aside1.current.handleOpen();
                break;
            default:
                this.setState({ photo: el });
                this.aside0.current.handleOpen("Légende de " + el.name);
                break;
        }

    }

    handleSaveLegend = (e) => {
        e.preventDefault();

        const { photo, photos } = this.state;

        let nPhotos = [];
        photos.forEach(elem => {
            if(elem.rank === photo.rank){
                elem.legend = photo.legend;
            }

            nPhotos.push(elem)
        })

        this.setState({ photos: nPhotos });
        this.aside0.current.handleClose();
    }

    handleSelectOwner = (owner) => {
        this.owner.current.handleUpdateSelectOwner(owner.id);
        this.aside1.current.handleClose();

        DataState.getOwners(this);
        this.setState({ owner: owner.id });
    }

    handleSelectRooms = (room, isUpdate=false) => {
        const { rooms } = this.state;

        let nRooms = helper.addOrRemove(rooms, room, "Pièce ajoutée.", "Pièce enlevée.", isUpdate, "Pièce modifiée.");
        this.setState({ rooms: nRooms });
        this.aside3.current.handleClose();
    }

    handleSubmit = (e, isDraft = true) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { codeTypeAd, codeTypeBien, libelle, codeTypeMandat, negotiator, photos } = this.state;

        // TODO : ----------------------------------
        // TODO : recheck all data before send
        // TODO : ----------------------------------
        let paramsToValidate = [
            {type: "text",      id: 'codeTypeAd',     value: codeTypeAd},
            {type: "text",      id: 'codeTypeBien',   value: codeTypeBien},
            {type: "text",      id: 'libelle',        value: libelle},
            {type: "text",      id: 'codeTypeMandat', value: codeTypeMandat},
            {type: "text",      id: 'negotiator',     value: negotiator},
            {type: "length",    id: 'libelle',        value: libelle, min: 0, max: 64},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate);

        Helper.toTop();
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            let self = this;
            Formulaire.loader(true);

            arrayZipcodeSave = this.state.arrayPostalCode;
            arrayOwnersSave = this.state.allOwners;
            delete this.state.arrayPostalCode;
            delete this.state.allOwners;

            this.state.isDraft = isDraft;

            let formatTxt = this.state.contentFull;
            this.state.contentFull = formatTxt.replaceAll("\n", "<br />");

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            let files = document.querySelector('#photos');
            for( let i = 0; i < files.files.length; i++ ){
                let file = files.files[i];
                formData.append('photos[' + i + ']', file);
            }

            this.setState({ allOwners: arrayOwnersSave })

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    toastr.info(messageSuccess);
                    setTimeout(function (){
                        location.reload();
                    }, 2000)
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { negotiators, quartiers, societyId, agencyId } = this.props;
        const { step, contentHelpBubble, codeTypeAd, owner, allOwners } = this.state;

        let steps = [
            {id: 1, label: "Informations globales"},
            {id: 2, label: "Details du bien (1/2)"},
            {id: 3, label: "Details du bien (2/2)"},
            {id: 4, label: "Details des pièces"},
            {id: 5, label: "Localisation"},
            {id: 6, label: "Financier"},
            {id: 7, label: "Photos"},
            {id: 8, label: "Contacts"},
            {id: 9, label: "Publication"},
        ];

        let stepTitle = "Etape 1 : Informations globales";
        let stepsItems = [];
        {steps.forEach(el => {
            let active = "";
            if(el.id === step){
                active = " active";
                stepTitle = "Etape " + el.id + " : " + el.label;
            }

            stepsItems.push(<div className={"item" + active} key={el.id} onClick={() => this.handleNext(el.id, step, true)}>
                <span className="number">{el.id}</span>
                <span className="label">{el.label}</span>
            </div>)
        })}

        let contentAside1 = <Owners ref={this.owner} donnees={JSON.stringify(allOwners)} negotiators={JSON.stringify(negotiators)}
                                    societyId={societyId} agencyId={agencyId} isClient={true}
                                    owner={owner} isFormBien={true} onSelectOwner={this.handleSelectOwner}/>

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
                    <Button type="warning" onClick={this.handleSubmit}>Enregistrer le brouillon</Button>
                </div>
                <section>
                    <form className="form-bien" onSubmit={(e) => this.handleSubmit(e, false)}>

                        <Step1 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate}
                               negotiators={negotiators} />

                        <Step2 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate} />

                        <Step3 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate} />

                        <Step4 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onSelectRooms={this.handleSelectRooms}
                               refAside={this.aside3} onOpenAside={this.handleOpenAside}
                                ref={this.rooms}/>

                        <Step5 {...this.state}  onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onChangeZipcode={this.handleChangeZipcode}
                               onChangeGeo={this.handleChangeGeo} quartiers={quartiers} />

                        {parseInt(codeTypeAd) === 1 ? <Step6 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                                                             onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} />
                            : <Step6Vente {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                                          onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} />}

                        <Step7 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChangeFile={this.handleChangeFile} onSwitchTrashFile={this.handleSwitchTrashFile}
                               onChangeLegend={this.handleChangeLegend} onSaveLegend={this.handleSaveLegend}
                               onDragStart={this.handleDragStart} onDrop={this.handleDrop} onDragLeave={this.handleDragLeave}
                               refAside={this.aside0} onOpenAside={this.handleOpenAside} />

                        <Step8 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate}
                               refAside1={this.aside1} onOpenAside={this.handleOpenAside}
                               allOwners={allOwners} />

                        <Step9 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onOpenHelp={this.handleOpenHelp}
                               onGenerateContent={this.handleGenerateContent}
                               negotiators={negotiators} />

                        {step === 9 && <div className="step-section active">
                            <div className="line line-buttons">
                                <div className="btns-submit">
                                    <Button isSubmit={true}>Enregistrer le bien</Button>
                                </div>
                            </div>
                        </div>}

                    </form>

                    <div className="contact-aside">
                        <Aside ref={this.aside1} content={contentAside1}>Sélectionner un propriétaire</Aside>
                    </div>
                </section>
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Aide</HelpBubble>
        </div>
    }
}

export function FormActions ({ onNext, onDraft, currentStep }) {
    return <div className="line line-buttons">
        <Button type="reverse" onClick={() => onNext(currentStep - 1, currentStep)}>Etape précédente</Button>
        <div/>
        <div className="btns-submit">
            <Button type="warning" onClick={onDraft}>Enregistrer le brouillon</Button>
            <Button onClick={() => onNext(currentStep + 1)}>Etape suivante</Button>
        </div>
    </div>
}
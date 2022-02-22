import React, { Component } from "react";

import axios    from "axios";
import toastr   from "toastr";

import helper           from "@userPages/components/Biens/functions/helper";
import Helper           from "@commonComponents/functions/helper";
import Validateur       from "@commonComponents/functions/validateur";
import Sort             from "@commonComponents/functions/sort";
import Formulaire       from "@dashboardComponents/functions/Formulaire";
import DataState        from "./Form/data";
import Automate         from "./functions/automate";
import Changer          from "./functions/changer";

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
import { Step10 }       from "@userPages/components/Biens/Steps/Step10";

import { Owners}        from "@dashboardPages/components/Immo/Owners/Owners";

let arrayZipcodeSave = [];
let arrayOwnersSave = [];
let initRank = null;

export class BienForm extends Component {
    constructor(props) {
        super(props);

        this.state = DataState.getDataState(props);

        this.helpBubble = React.createRef();
        this.aside0 = React.createRef(); //image
        this.aside1 = React.createRef(); //owner
        this.aside3 = React.createRef(); //piece
        this.owner  = React.createRef();
        this.rooms  = React.createRef();

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
        const { settings, codeTypeAd, rooms, price, notaire, honoraireTtc, honorairePourcentage,
            provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail, startAt, nbMonthMandat, supports } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        Automate.consequenceValueToBoolean(this, name, value, "areaGarden",  0, "hasGarden");
        Automate.consequenceValueToBoolean(this, name, value, "areaTerrace", 0, "hasTerrace");
        Automate.consequenceValueToBoolean(this, name, value, "areaCave",    0, "hasCave");

        let elStep = this.rooms.current;
        Automate.consequenceValueToRooms(this, name, value, rooms, "room",       4, elStep);
        Automate.consequenceValueToRooms(this, name, value, rooms, "bathroom",   9, elStep);
        Automate.consequenceValueToRooms(this, name, value, rooms, "wc",         12, elStep);
        Automate.consequenceValueToRooms(this, name, value, rooms, "balcony",    1, elStep);
        Automate.consequenceValueToRooms(this, name, value, rooms, "box",        2, elStep);

        Automate.calculateFinancial(this, name, value, codeTypeAd, price, notaire, honoraireTtc, honorairePourcentage,
            provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail);

        if(name === "newQuartier"){
            value = (e.currentTarget.checked) ? [parseInt(value)] : [] // parseInt because work with int this time
        }

        if(name === "nbMonthMandat"){
            Changer.setEndMandat(this, startAt, value)
        }

        if(name === "codeTypeAd" && nbMonthMandat === "init"){
            this.setState({ nbMonthMandat: parseInt(value) === 1 ? settings.mandatMonthLocation : settings.mandatMonthVente })
        }

        if(name === "supports"){
            value = Formulaire.updateValueCheckbox(e, supports, parseInt(value));
        }

        this.setState({[name]: value });
    }

    handleChangeSelect = (name, e) => {
        const { codeTypeAd, price, notaire, honoraireTtc, honorairePourcentage,
            provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail } = this.state;

        let value = e !== undefined ? e.value : "";

        if(name === "typeCalcul"){
            Automate.calculateFinancial(this, name, value, codeTypeAd, price, notaire, honoraireTtc, honorairePourcentage,
                provisionCharges, provisionOrdures, typeCalcul, tva, honoraireBail);
        }

        this.setState({ [name]: value })
    }

    handleChangeDate = (name, e) => {
        const { nbMonthMandat } = this.state;

        let value = e !== null ? e : "";
        if(name === "startAt"){ Changer.setEndMandat(this, value, nbMonthMandat) }

        this.setState({ [name]: value })
    }

    handleChangeZipcode = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode ? arrayPostalCode : arrayZipcodeSave)
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
                            Automate.getBase64(file, self, rank);
                            rank++;
                        }
                    }
                }else{
                    toastr.error("Vous avez atteint la limite max de photos.")
                }
            })
        }
    }

    handleGenerateContent = (type) => {
        if(type === "simple"){
            this.setState({ contentSimple: helper.setContentSimple(this) })
        }else{
            this.setState({ contentFull: helper.setContentFull(this) })
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

    handleNext = (stepClicked, stepInitial = null, fromMenu = false) => {
        const { codeTypeAd, codeTypeBien, libelle, codeTypeMandat, negotiator,
            areaHabitable, piece, priceEstimate, price } = this.state;

        this.setState({ errors: [] })

        let paramsToValidate = [];
        if(stepInitial === null || fromMenu === true){
            let stepValue = fromMenu ? stepInitial + 1 : stepClicked;
            switch (stepValue){
                case 3:
                    paramsToValidate = [
                        {type: "text",      id: 'areaHabitable',  value: areaHabitable},
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

                    if(priceEstimate !== "" && price === ""){
                        this.setState({ price: priceEstimate })
                    }
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

    handleSubmit = (e, isDraft = true) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { codeTypeAd, codeTypeBien, libelle, codeTypeMandat, negotiator, photos } = this.state;

        this.setState({ errors: [] })

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
        const { negotiators, quartiers, sols, sousTypes, societyId, agencyId, settings, allSupports } = this.props;
        const { step, contentHelpBubble, codeTypeAd, owner, allOwners } = this.state;

        let steps = [
            {id: 1,  label: "Informations globales"},
            {id: 2,  label: "Details du bien (1/2)"},
            {id: 3,  label: "Details du bien (2/2)"},
            {id: 4,  label: "Details des pièces"},
            {id: 5,  label: "Localisation"},
            {id: 6,  label: "Financier"},
            {id: 7,  label: "Photos"},
            {id: 8,  label: "Contacts"},
            {id: 9,  label: "Description"},
            {id: 10, label: "Diffusions"},
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
                               negotiators={negotiators} settings={settings} />

                        <Step2 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate} />

                        <Step3 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onChange={this.handleChange} onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate}
                               sols={sols} sousTypes={sousTypes}/>

                        <Step4 {...this.state} onDraft={this.handleSubmit} onNext={this.handleNext}
                               onSelectRooms={this.handleSelectRooms}
                               refAside={this.aside3} onOpenAside={this.handleOpenAside}
                               ref={this.rooms} sols={sols}/>

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

                        <Step10 {...this.state} onSubmit={this.handleSubmit}
                                onChange={this.handleChange} allSupports={allSupports}/>

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
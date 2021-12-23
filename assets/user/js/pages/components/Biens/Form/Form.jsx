import React, { Component } from "react";

import axios    from "axios";
import toastr   from "toastr";
import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Helper       from "@commonComponents/functions/helper";
import Validateur   from "@commonComponents/functions/validateur";
import Formulaire   from "@dashboardComponents/functions/Formulaire";
import DataState    from "./data";

import { HelpBubble }   from "@dashboardComponents/Tools/HelpBubble";
import { Button }       from "@dashboardComponents/Tools/Button";

import { Step1 } from "@userPages/components/Biens/Steps/Step1";
import { Step2 } from "@userPages/components/Biens/Steps/Step2";
import { Step3 } from "@userPages/components/Biens/Steps/Step3";
import { Step4 } from "@userPages/components/Biens/Steps/Step4";
import { Step5 } from "@userPages/components/Biens/Steps/Step5";
import { Step5Vente } from "@userPages/components/Biens/Steps/Step5Vente";
import { Step6 } from "@userPages/components/Biens/Steps/Step6";

const ARRAY_STRING_BIENS = ["Appartement", "Maison", "Parking/Box", "Terrain", "Boutique", "Bureau", "Château", "Immeuble", "Terrain + Maison", "Divers"];

let arrayZipcodeSave = [];
let initRank = null;

function getBase64(file, self, rank) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        self.setState({ photos: [...self.state.photos, ...[{
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
        this.aside = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeLegend = this.handleChangeLegend.bind(this);

        this.handleSwitchTrashFile = this.handleSwitchTrashFile.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleOpenAside = this.handleOpenAside.bind(this);
        this.handleSaveLegend = this.handleSaveLegend.bind(this);

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

    handleChangeLegend = (e, el) => {
        el.legend = e.currentTarget.value;
        this.setState({ photo: el })
    }

    handleChangeFile = (e) => {
        const { photos } = this.state;

        let files = e.target.files;
        let self = this;

        let rank = photos.length + 1;
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

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleChangeDate = (name, e) => { this.setState({ [name]: e !== null ? e : "" }) }

    handleChangeZipcode = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode ? arrayPostalCode : arrayZipcodeSave)
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
            this.setState({ errors: [], step: stepClicked })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;

        // TODO : ----------------------------------
        // TODO : recheck all data before send
        // TODO : ----------------------------------

        let self = this;
        Formulaire.loader(true);

        arrayZipcodeSave = this.state.arrayPostalCode;
        delete this.state.arrayPostalCode;

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

    handleSwitchTrashFile = (el) => {
        const { photos } = this.state;

        let nPhotos = [];
        photos.forEach(elem => {
            if(elem.rank === el.rank){
                elem.isTrash = !elem.isTrash;
            }

            nPhotos.push(elem)
        })

        this.setState({ photos: nPhotos })
    }

    handleDragStart = (e, rank) => {
        initRank = rank;
    }

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

    handleOpenAside = (el) => {
        this.setState({ photo: el });
        this.aside.current.handleOpen("Légende de " + el.name);
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
        this.aside.current.handleClose();
    }

    render () {
        const { negotiators } = this.props;
        const { step, contentHelpBubble, codeTypeAd } = this.state;

        let steps = [
            {id: 1, label: "Informations globales"},
            {id: 2, label: "Details du bien (1/2)"},
            {id: 3, label: "Details du bien (2/2)"},
            {id: 4, label: "Localisation"},
            {id: 5, label: "Financier"},
            {id: 6, label: "Photos"},
            {id: 7, label: "Contact"},
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

            stepsItems.push(<div className={"item" + active} key={el.id} onClick={() => this.handleNext(el.id, step, true)}>
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
                               onOpenHelp={this.handleOpenHelp} negotiators={negotiators} />

                        <Step2 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                               onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate} />

                        <Step3 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                               onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate} />

                        <Step4 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                               onChangeSelect={this.handleChangeSelect} onChangeDate={this.handleChangeDate}
                               onChangeZipcode={this.handleChangeZipcode} />

                        {parseInt(codeTypeAd) === 1 ? <Step5 {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                                                             onChangeSelect={this.handleChangeSelect} />
                            : <Step5Vente {...this.state} onNext={this.handleNext} onChange={this.handleChange}
                                          onChangeSelect={this.handleChangeSelect} />}

                        <Step6 {...this.state} onNext={this.handleNext} onChangeFile={this.handleChangeFile}
                               onSwitchTrashFile={this.handleSwitchTrashFile} onChangeLegend={this.handleChangeLegend}
                               onDragStart={this.handleDragStart} onDrop={this.handleDrop} onDragLeave={this.handleDragLeave}
                               refAside={this.aside} onOpenAside={this.handleOpenAside} onSaveLegend={this.handleSaveLegend} />

                        <div className="step-section active">
                            <div className="line line-buttons">
                                <div />
                                <div />
                                <div className="btns-submit">
                                    <Button isSubmit={true}>Enregistrer le bien</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Aide</HelpBubble>
        </div>
    }
}
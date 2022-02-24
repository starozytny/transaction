import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";

export class Diag extends Component{
    constructor(props) {
        super(props);

        this.state = {
            status: false
        }

        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen = (status) => { this.setState({ status: !status }) }

    render () {
        const { isPrint = false, elem } = this.props;
        const { status } = this.state;

        let content = <div>Le diagnostic de performance énergétique et d'indice d'émission de gaz à effet de serre n'ont pas été soumis pour le moment.</div>
        let dpeNotFound = <div>Le diagnostic de performance énergétique n'a pas été soumis pour le moment.</div>
        let gesNotFound = <div>L'indice d'émission de gaz à effet de serre n'a pas été soumis pour le moment.</div>
        let dpeVierge = <div>Le diagnostic de performance énergétique est vierge.</div>
        let gesVierge = <div>L'indice d'émission de gaz à effet de serre est vierge.</div>

        if(elem.diag){
            let diag = elem.diag;

            let savoirPlus = "";
            if(!diag.isVirgin && diag.gesLetterString && diag.gesLetterString !== "NS" && diag.gesLetterString !== "VI" &&
                diag.dpeLetterString && diag.dpeLetterString !== "NS" && diag.dpeLetterString !== "VI")
            {
                savoirPlus = <div className="diag-plus">
                    <Button type="default" onClick={() => this.handleOpen(status)}>En savoir plus</Button>
                </div>
            }

            let diagBeforeJuly = "";
            if(!diag.isVirgin && diag.gesLetterString && diag.gesLetterString !== "NS" && diag.gesLetterString !== "VI" &&
                diag.dpeLetterString && diag.dpeLetterString !== "NS" && diag.dpeLetterString !== "VI")
            {
                if(diag.beforeJuly){
                    diagBeforeJuly = "Diagnostic réalisé avant le 1er Juillet 2021"
                }else{
                    diagBeforeJuly = "Diagnostic réalisé après le 1er Juillet 2021"
                }

                if(diag.createdAtDpeString){
                    diagBeforeJuly = <>
                        <div>
                            <div className="label">Date de réalisation du DPE</div>
                            <div>{diag.createdAtDpeString}</div>
                        </div>
                        <div>
                            <div className="label">Année de référence conso DPE</div>
                            <div>{diag.referenceDpe}</div>
                        </div>
                        <div>
                            <div className="label">Estimation des coûts annuels minimun</div>
                            <div>{diag.minAnnual}</div>
                        </div>
                        <div>
                            <div className="label">Estimation des coûts annuels maximum</div>
                            <div>{diag.maxAnnual}</div>
                        </div>
                    </>
                }
            }

            content = <>
                {!isPrint && <div className="details-tab-infos-main">
                    {diagBeforeJuly}
                </div>}
                <div className="details-tab-infos-main">
                    {diag.dpeLetterString ? <>
                        {diag.dpeLetterString !== "NS" && diag.dpeLetterString !== "VI" ? <>
                            <DiagSimple isDpe={true} elem={elem}/>
                            {status && <DiagDetails isDpe={true} elem={elem}/>}
                        </> : (diag.dpeLetterString !== "NS" && !diag.isVirgin) ? dpeNotFound : dpeVierge}
                    </> : dpeNotFound}
                </div>

                <div className="details-tab-infos-main">
                    {diag.gesLetterString ? <>
                        {diag.gesLetterString !== "NS" && diag.gesLetterString !== "VI" ? <>
                            <DiagSimple isDpe={false} elem={elem}/>
                            {status && <DiagDetails isDpe={false} elem={elem}/>}
                        </> : (diag.gesLetterString !== "NS" && !diag.isVirgin) ? gesNotFound : gesVierge}
                    </> : gesNotFound}
                </div>

                {!isPrint ? savoirPlus : null}
            </>
        }

        return (<div className="details-tab-infos">
            {content}
        </div>)
    }
}

function DiagSimple({ isDpe, elem })
{
    let letters = ["A", "B", "C", "D", "E", "F", "G"];
    let title = isDpe ? "Diagnostic de performance énergétique en kWhEP/m².an" : "Indice d'émission de gaz à effet de serre en kgeqCO2/m².an";
    let classDiag = isDpe ? "dpe" : "ges";
    let value = isDpe ? elem.diag.dpeValue : elem.diag.gesValue;

    return (
        <div className="diagnostic">
            <div>
                <div className="diag-title">{title}</div>
                <div className={"diag-" + classDiag}>
                    {letters.map(le => {

                        let comparator = isDpe ? elem.diag.dpeLetterString : elem.diag.gesLetterString;
                        let classActive = isDpe ? " dpe_is-active" : " ges_is-active";
                        let active = comparator === le ? classActive : "";

                        return <div key={le}>
                            <div className={classDiag + " " + classDiag + "-" + le.toLowerCase() + active}>
                                <div>{le}</div>
                            </div>
                            <div className="number">{value ? value : "N.C"}</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

function DiagDetails({ isDpe, elem })
{
    let lettersDetails = [
        { le :"A", valDpe: "≤ 50", valGes: "≤ 5" },
        { le :"B", valDpe: "51 à 90", valGes: "6 à 10" },
        { le :"C", valDpe: "91 à 150", valGes: "11 à 20" },
        { le :"D", valDpe: "151 à 230", valGes: "21 à 35" },
        { le :"E", valDpe: "231 à 330", valGes: "36 à 55" },
        { le :"F", valDpe: "331 à 450", valGes: "56 à 80" },
        { le :"G", valDpe: "> 450", valGes: "> 80" }
    ]
    let classDiag = isDpe ? "dpe" : "ges";
    let unity = isDpe ? "kWhEP/m².an" : "kgeqCO2/m².an";
    let value = isDpe ? elem.diag.dpeValue : elem.diag.gesValue;

    return (
        <div className="diagnostic-details">
            <div className={"diag-" + classDiag}>
                {lettersDetails.map(le => {

                    let comparator = isDpe ? elem.diag.dpeLetterString : elem.diag.gesLetterString;
                    let classActive = isDpe ? " dpe_is-active2" : " ges_is-active2";
                    let active = comparator === le.le ? classActive : "";

                    return <div key={le.le}>
                        <div className={classDiag + " " + classDiag + "-" + le.le.toLowerCase() + active}>
                            <div>{le.le}</div>
                        </div>
                        <div className="number">{value ? value + " " + unity : "N.C"}</div>
                    </div>
                })}
            </div>
        </div>
    )
}
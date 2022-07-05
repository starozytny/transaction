import React, { Component } from "react";

import Sanitaze from "@commonComponents/functions/sanitaze";

export class Diag extends Component{
    render () {
        const { elem } = this.props;

        let content     = <div>Le diagnostic de performance énergétique et d'indice d'émission de gaz à effet de serre n'ont pas été soumis pour le moment.</div>
        let dpeNotFound = <div>Le diagnostic de performance énergétique n'a pas été soumis pour le moment.</div>
        let gesNotFound = <div>L'indice d'émission de gaz à effet de serre n'a pas été soumis pour le moment.</div>
        let dpeVierge   = <div>Le diagnostic de performance énergétique est vierge.</div>
        let gesVierge   = <div>L'indice d'émission de gaz à effet de serre est vierge.</div>

        if(elem.diag){

            let diagnostic = elem.diag;

            let dateDiag = ""; let diagInfos = null;
            if(!diagnostic.isVirgin && diagnostic.gesLetterString && diagnostic.gesLetterString !== "NS" && diagnostic.gesLetterString !== "VI"
                && diagnostic.dpeLetterString && diagnostic.dpeLetterString !== "NS" && diagnostic.dpeLetterString !== "VI")
            {
                dateDiag = "Diagnostic réalisé " + (diagnostic.beforeJuly ? "avant" : "après") + " le 1er Juillet 2021"

                if(diagnostic.createdAtDpeString){
                    dateDiag = <div className="date-release">Diagnostic réalisé le {diagnostic.createdAtDpeString}</div>
                }

                diagInfos = <>
                    {diagnostic.referenceDpe ? <>
                        <div>Date de référence des prix de l'énergie utilisés pour établir cette estimation : {diagnostic.referenceDpe}</div>
                    </> : ""}
                    {diagnostic.minAnnual && diagnostic.minAnnual !== 0 && diagnostic.maxAnnual && diagnostic.maxAnnual !== 0 ? <>
                        <div>Montant estimé des dépenses annuelles d'énergie
                            pour un usage
                            standard : entre {Sanitaze.toFormatCurrency(diagnostic.minAnnual)} et {Sanitaze.toFormatCurrency(diagnostic.maxAnnual)} / an</div>
                    </> : ""}
                </>
            }

            content = <>
                <div className="diag-infos">
                    {dateDiag}
                    {diagInfos}
                </div>

                <div className="graphs">
                    <div className="graph">
                        {diagnostic.dpeLetter ? <>
                            {diagnostic.dpeLetterString !== "NS" && diagnostic.dpeLetterString !== "VI" ? <>
                                <DiagDetails isDpe={true} elem={elem}/>
                                {diagnostic.dpeLetterString === "F" || diagnostic.dpeLetterString === "G" && <>
                                    <div className="diag-excessif">Logement à consommation énergétique excessive : classe {diagnostic.dpeLetterString}</div>
                                </>}
                            </> : (diagnostic.dpeLetterString !== "NS") ? dpeNotFound : dpeVierge}
                        </> : dpeNotFound}
                    </div>

                    <div className="graph">
                        {diagnostic.gesLetter ? <>
                            {diagnostic.gesLetterString !== "NS" && diagnostic.gesLetterString !== "VI" ? <>
                                <DiagDetails isDpe={false} elem={elem}/>
                            </> : (diagnostic.gesLetterString !== "NS") ? gesNotFound : gesVierge}
                        </> : gesNotFound}
                    </div>
                </div>
            </>
        }

        return <div className="diagnostics">
            {content}
        </div>
    }
}

export function DiagDetails({ isDpe, elem })
{
    let title = isDpe ? "Diagnostic de performance énergétique" : "Indice d'émission de gaz à effet de serre";
    let lettersDetails = [
        { le :"A", valDpe: "≤ 70", valGes: "≤ 6" },
        { le :"B", valDpe: "70 à 110", valGes: "6 à 11" },
        { le :"C", valDpe: "110 à 180", valGes: "11 à 30" },
        { le :"D", valDpe: "180 à 250", valGes: "30 à 50" },
        { le :"E", valDpe: "250 à 330", valGes: "50 à 70" },
        { le :"F", valDpe: "331 à 420", valGes: "70 à 100" },
        { le :"G", valDpe: "> 420", valGes: "> 100" }
    ]
    let classDiag = isDpe ? "dpe" : "ges";
    let unity = isDpe ? "kWh/m²/an" : "kgCO2/m²/an";
    let borneA = isDpe ? "Logement extrêmement performant" : "Peu d'émissions de CO2";
    let borneB = isDpe ? "Logement extrêmement peu performant" : "Emission de CO2 très importantes";
    let value = isDpe ? elem.diag.dpeValue : elem.diag.gesValue;

    return <>
        <div className="diag-title">{title}</div>
        <div className={"diagnostic diagnostic-" + classDiag}>
            <div className="diag-borne">{borneA}</div>
            <div className="diag-details">
                <div className={"diag-" + classDiag}>
                    {lettersDetails.map(le => {

                        let comparator = isDpe ? elem.diag.dpeLetterString : elem.diag.gesLetterString;
                        let active = comparator === le.le ? " active" : "";

                        return <div className={"diag-line" + active} key={le.le}>
                            <div className="number">
                                <div className="value">{value ? value : "N.C"}</div>
                                {comparator === le.le ? <>
                                    <div className="unity">{unity}</div>
                                    <div className="flottant">
                                        {isDpe ? <>
                                            <div>consommation</div>
                                            <div>(énergie primaire)</div>
                                        </> : <>
                                            <div>émissions</div>
                                        </>}
                                    </div>
                                </> : null}
                            </div>
                            {isDpe ? <>
                                <div className="number number-2">
                                    <div className="value">{elem.diag.gesValue ? elem.diag.gesValue : "N.C"}</div>
                                    {comparator === le.le ? <>
                                        <div className="unity">kgCO2/m²/an</div>
                                        <div className="flottant">
                                            <div>émissions</div>
                                        </div>
                                    </> : null}
                                </div>
                            </> : null}
                            <div className={"diag-letter " + classDiag + " " + classDiag + "-" + le.le.toLowerCase()} key={le.le}>
                                <div className="letter">{le.le}</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div className="diag-borne">{borneB}</div>
        </div>
    </>
}

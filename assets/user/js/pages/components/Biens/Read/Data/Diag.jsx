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
    let lettersDetails = ["", "A", "B", "C", "D", "E", "F", "G"];
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
                    {lettersDetails.map((letter, index) => {
                        if(index !== 0){
                            let comparator = isDpe ? elem.diag.dpeLetter : elem.diag.gesLetter;
                            if(isDpe && elem.diag.gesLetter && elem.diag.gesLetter > elem.diag.dpeLetter){
                                comparator = elem.diag.gesLetter;
                            }

                            let active = comparator === index ? " active" : "";

                            return <div className={"diag-line" + active} key={index}>
                                <div className="number">
                                    <div className="value">{value ? value : "N.C"}</div>
                                    {comparator === index ? <>
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
                                        {comparator === index ? <>
                                            <div className="unity">kgCO2/m²/an</div>
                                            <div className="flottant">
                                                <div>émissions</div>
                                            </div>
                                        </> : null}
                                    </div>
                                </> : null}
                                <div className={"diag-letter " + classDiag + " " + classDiag + "-" + lettersDetails[index].toLowerCase()}>
                                    <div className="letter">{lettersDetails[index]}</div>
                                </div>
                            </div>
                        }
                    })}
                </div>
            </div>
            <div className="diag-borne">{borneB}</div>
        </div>
    </>
}

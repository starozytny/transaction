import React     from "react";
import Sanitize  from "@commonComponents/functions/sanitaze";

export function Financial({ elem }){
    return (<div className="details-tab-infos">
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Loyer charges comprises</div>
                <div>{Sanitize.toFormatCurrency(elem.financial.price)} cc / mois</div>
            </div>
            <div>
                <div className="label">Provisions pour charge (Soumis à régularisation annuelle)</div>
                <div>{Sanitize.toFormatCurrency(elem.financial.charges)}</div>
            </div>
            <div>
                <div className="label">Dépôt de garantie</div>
                <div>{Sanitize.toFormatCurrency(elem.financial.deposit)}</div>
            </div>
        </div>
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Honoraire à la charge du locataire avec état des lieux</div>
                <div>{Sanitize.toFormatCurrency(elem.financial.commission)} TTC</div>
            </div>
            <div>
                <div className="label">Etat des lieux</div>
                <div>{Sanitize.toFormatCurrency(elem.financial.partHonoEdl)}</div>
            </div>
        </div>
    </div>)
}

export function FinancialVente({ elem }){
    let financial = elem.financial;
    console.log(financial.honoraireChargeDe)

    return (<div className="details-tab-infos">
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Prix de vente</div>
                <div>{Sanitize.toFormatCurrency(financial.price)}</div>
            </div>
            <div>
                <div className="label">Charges mensuelles</div>
                <div>{Sanitize.toFormatCurrency(financial.chargesMensuelles)}</div>
            </div>
            <div>
                <div className="label">Frais de notaire</div>
                <div>{Sanitize.toFormatCurrency(financial.notaire)}</div>
            </div>
            <div>
                <div className="label">Impôt foncier</div>
                <div>{Sanitize.toFormatCurrency(financial.foncier)}</div>
            </div>
            <div>
                <div className="label">Taxe habitation</div>
                <div>{Sanitize.toFormatCurrency(financial.taxeHabitation)}</div>
            </div>
        </div>
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Honoraire à la charge</div>
                <div>{financial.honoraireChargeDeString}</div>
            </div>
            {financial.honoraireChargeDe === 0 && <div>
                <div className="label">Prix hors honoraire acquéreur</div>
                <div>{Sanitize.toFormatCurrency(financial.priceHorsAcquereur)}</div>
            </div>}
            <div>
                <div className="label">Pourcentage des honoraires</div>
                <div>{financial.honorairePourcentage}%</div>
            </div>
            <div>
                <div className="label">Honoraires</div>
                <div>{Sanitize.toFormatCurrency(financial.honoraireTtc)} TTC</div>
            </div>
        </div>
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Bien en copropriété</div>
                <div>{Sanitize.toTrilleanString(financial.isCopro)}</div>
            </div>
            {financial.isCopro && <>
                <div>
                    <div className="label">Nombre de lots</div>
                    <div>{financial.nbLot}</div>
                </div>
                <div>
                    <div className="label">Montant annuel des charges du lot</div>
                    <div>{Sanitize.toFormatCurrency(financial.chargesLot)}</div>
                </div>
            </>}
        </div>
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Le syndicat fait l'objet d'une procédure ?</div>
                <div>{Sanitize.toTrilleanString(financial.isSyndicProcedure)}</div>
            </div>
            {financial.isSyndicProcedure === 1 && <>
                <div>
                    <div className="label">Détails</div>
                    <div>{financial.detailsProcedure}</div>
                </div>
            </>}
        </div>
    </div>)
}
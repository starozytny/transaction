import React     from "react";

import parseHtml from "html-react-parser";
import Sanitize  from "@commonComponents/functions/sanitaze";

export function Infos({ elem }){
    return (<div className="details-tab-infos">
        <div className="details-tab-infos-main details-identifiant">
            <div>
                <div className="label">Identifiant immuable</div>
                <div>{elem.identifiant}</div>
            </div>
            <div>
                <div className="label">Référence</div>
                <div>{elem.reference}</div>
            </div>
            {elem.codeTypeAd === 1 && <div>
                <div className="label">Bien meublé</div>
                <div>{Sanitize.toTrilleanString(elem.feature.isMeuble)}</div>
            </div>}
            {elem.feature.dispoAtString && <div>
                <div className="label">Disponibilité</div>
                <div>{elem.feature.dispoAtString}</div>
            </div>}
        </div>

        <div className="details-tab-infos-content">
            <div className="content">
                <div className="label">Courte description du bien immobilier</div>
                <p>{parseHtml(elem.advert.contentSimple)}</p>
            </div>
            <div className="content">
                <div className="label">Complète description du bien immobilier</div>
                <p>{parseHtml(elem.advert.contentFull)}</p>
            </div>
        </div>
    </div>)
}
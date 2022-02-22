import React     from "react";
import Sanitize  from "@commonComponents/functions/sanitaze";

export function Features({ elem }){
    let number = elem.number;
    let area = elem.area;
    let feature = elem.feature;
    let advantage = elem.advantage;

    return (<div className="details-tab-infos">
        <div className="details-tab-infos-content">
            <div className="label">Nombre de..</div>
        </div>
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Pièces</div>
                <div>{number.piece}</div>
            </div>
            <div>
                <div className="label">Chambres</div>
                <div>{number.room}</div>
            </div>
            <div>
                <div className="label">Salles de bain</div>
                <div>{number.bathroom}</div>
            </div>
            <div>
                <div className="label">WC</div>
                <div>{number.wc}</div>
            </div>
            <div>
                <div className="label">Balcons</div>
                <div>{number.balcony}</div>
            </div>
            <div>
                <div className="label">Parkings</div>
                <div>{number.parking}</div>
            </div>
            <div>
                <div className="label">Box</div>
                <div>{number.box}</div>
            </div>
        </div>

        <div className="details-tab-infos-content"><div className="content" /></div>

        <div className="details-tab-infos-content">
            <div className="label">Surfaces (m²)</div>
        </div>
        <div className="details-tab-infos-main">
            <div>
                <div className="label">Total</div>
                <div>{area.total}</div>
            </div>
            <div>
                <div className="label">Habitable</div>
                <div>{area.habitable}</div>
            </div>
            <div>
                <div className="label">Terrain</div>
                <div>{area.land}</div>
            </div>
            <div>
                <div className="label">Garden</div>
                <div>{area.garden}</div>
            </div>
            <div>
                <div className="label">Terrasse</div>
                <div>{area.terrace}</div>
            </div>
            <div>
                <div className="label">ave</div>
                <div>{area.cave}</div>
            </div>
            <div>
                <div className="label">Salle de bain</div>
                <div>{area.bathroom}</div>
            </div>
            <div>
                <div className="label">Salon</div>
                <div>{area.living}</div>
            </div>
        </div>

        <div className="details-tab-infos-main">
            <div>
                <div className="label">Année de construction</div>
                <div>{feature.buildAt ? feature.buildAt : "/"}</div>
            </div>
            <div>
                <div className="label">Occupation</div>
                <div>{feature.busyString}</div>
            </div>
            <div>
                <div className="label">Refait à neuf</div>
                <div>{Sanitize.toTrilleanString(feature.isNew)}</div>
            </div>
            <div>
                <div className="label">Exposition</div>
                <div>{feature.expositionString}</div>
            </div>
            <div>
                <div className="label">WC séparé</div>
                <div>{Sanitize.toTrilleanString(feature.isWcSeparate)}</div>
            </div>
        </div>

        <div className="details-tab-infos-main">
            <div>
                <div className="label">Etage</div>
                <div>{feature.floor}</div>
            </div>
            <div>
                <div className="label">Nombre d'étages</div>
                <div>{feature.nbFloor}</div>
            </div>
        </div>

        <div className="details-tab-infos-main">
            <div>
                <div className="label">Type de chauffage</div>
                <div>{feature.codeHeater}</div>
            </div>
            <div>
                <div className="label">Type de cuisine</div>
                <div>{feature.codeKitchen}</div>
            </div>
            <div>
                <div className="label">Type d'eau chaude</div>
                <div>{feature.codeWater}</div>
            </div>
        </div>

        <div className="details-tab-infos-content"><div className="content" /></div>

        <div className="details-tab-infos-content">
            <div className="label">Avantages</div>
        </div>

        <div className="details-tab-infos-main">
            <div>
                <div className="label">Jardin</div>
                <div>{Sanitize.toTrilleanString(advantage.hasGarden)}</div>
            </div>
            <div>
                <div className="label">Terrasse</div>
                <div>{Sanitize.toTrilleanString(advantage.hasTerrace)}</div>
            </div>
            <div>
                <div className="label">Piscine</div>
                <div>{Sanitize.toTrilleanString(advantage.hasPool)}</div>
            </div>
            <div>
                <div className="label">Cave</div>
                <div>{Sanitize.toTrilleanString(advantage.hasCave)}</div>
            </div>
            <div>
                <div className="label">Digicode</div>
                <div>{Sanitize.toTrilleanString(advantage.hasDigicode)}</div>
            </div>
            <div>
                <div className="label">Interphone</div>
                <div>{Sanitize.toTrilleanString(advantage.hasInterphone)}</div>
            </div>
            <div>
                <div className="label">Gardien</div>
                <div>{Sanitize.toTrilleanString(advantage.hasGuardian)}</div>
            </div>
            <div>
                <div className="label">Alarme</div>
                <div>{Sanitize.toTrilleanString(advantage.hasAlarme)}</div>
            </div>
            <div>
                <div className="label">Ascenseur</div>
                <div>{Sanitize.toTrilleanString(advantage.hasLift)}</div>
            </div>
            <div>
                <div className="label">Climatisation</div>
                <div>{Sanitize.toTrilleanString(advantage.hasClim)}</div>
            </div>
            <div>
                <div className="label">Calme</div>
                <div>{Sanitize.toTrilleanString(advantage.hasCalme)}</div>
            </div>
            <div>
                <div className="label">Aménagement pour handicapés</div>
                <div>{Sanitize.toTrilleanString(advantage.hasHandi)}</div>
            </div>
            <div>
                <div className="label">Internet</div>
                <div>{Sanitize.toTrilleanString(advantage.hasInternet)}</div>
            </div>
            <div>
                <div className="label">Internet avec la fibre</div>
                <div>{Sanitize.toTrilleanString(advantage.hasFibre)}</div>
            </div>
        </div>

        <div className="details-tab-infos-main">
            <div>
                <div className="label">Situation</div>
                <div>{advantage.situation}</div>
            </div>
            <div>
                <div className="label">Sous type de bien</div>
                <div>{advantage.sousType}</div>
            </div>
            <div>
                <div className="label">Type de sol</div>
                <div>{advantage.sol}</div>
            </div>
        </div>

    </div>)
}
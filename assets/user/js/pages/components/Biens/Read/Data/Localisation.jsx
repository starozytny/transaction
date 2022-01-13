import React, {Component} from "react";

import Sanitize from "@commonComponents/functions/sanitaze";
import Map      from "@commonComponents/functions/map";
import L from "leaflet/dist/leaflet";

let mymap = null;

export class Localisation extends Component {

    componentDidMount () {
        mymap = Map.createMap(43.297648, 5.372835, 15, 13, 30);
    }

    render () {
        const { elem } = this.props;

        let localisation = elem.localisation;

        const divStyle = {
            height: '50vh'
        };

        if(localisation.lat && localisation.lon && mymap){
            let marker = L.marker([localisation.lat, localisation.lon], {icon: Map.getOriginalLeafletIcon("../")}).addTo(mymap);
        }

        return (<div className="details-tab-infos">
            <div className="details-tab-infos-main">
                <div>
                    <div className="label">Masquer l'adresse</div>
                    <div>{Sanitize.toTrilleanString(localisation.hideAddress)}</div>
                </div>
            </div>
            <div className="details-tab-infos-main">
                <div>
                    <div className="label">Adresse</div>
                    <div>{localisation.address}</div>
                </div>
                <div>
                    <div className="label">Code postal</div>
                    <div>{localisation.zipcode}</div>
                </div>
                <div>
                    <div className="label">Ville</div>
                    <div>{localisation.city}</div>
                </div>
                <div>
                    <div className="label">Pays</div>
                    <div>{localisation.country}</div>
                </div>
                <div>
                    <div className="label">Département</div>
                    <div>{localisation.departement}</div>
                </div>
                <div>
                    <div className="label">Quartier</div>
                    <div>{localisation.quartier}</div>
                </div>
            </div>

            <div className="details-tab-infos-main">
                <div>
                    <div className="label">Masquer la géolocalisation</div>
                    <div>{Sanitize.toTrilleanString(localisation.hideMap)}</div>
                </div>
            </div>

            <div className="details-tab-infos-main">
                <div>
                    <div className="label">Latitude</div>
                    <div>{localisation.lat}</div>
                </div>
                <div>
                    <div className="label">Longitude</div>
                    <div>{localisation.lon}</div>
                </div>
            </div>

            <div id="mapid" style={divStyle} />

        </div>)
    }
}
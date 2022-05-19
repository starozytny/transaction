import React, { Component } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-ajax/dist/leaflet.ajax.min";

import Map from "@commonComponents/functions/map";
import L from "leaflet/dist/leaflet";

let mymap = null;

export class BiensMap extends Component {
    componentDidMount() {
        const { donnees } = this.props;
        mymap = Map.createMap(43.297648, 5.372835, 15, 13, 30);

        let data = JSON.parse(donnees);

        data.forEach(el => {
            if(el.localisation){
                let marker = L.marker([el.localisation.lat, el.localisation.lon], {icon: Map.getLeafletMarkerIcon("book")}).addTo(mymap);
                marker.bindPopup("<b>"+el.libelle+"</b>").openPopup();
            }
        })
    }

    render () {
        return <div className="main-content">
            <div id="mapid"/>
        </div>
    }
}

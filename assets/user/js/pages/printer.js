import "../../css/pages/printer.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { PrintBien } from "@userPages/components/Impressions/PrintBien";
import { RapportOwner } from "@userPages/components/Impressions/Rapport/RapportOwner";
import { RapportBien } from "@userPages/components/Impressions/Rapport/RapportBien";

Routing.setRoutingData(routes);

let el = document.getElementById("printer-bien");
if(el){
    render(<PrintBien {...el.dataset} />, el)
}

el = document.getElementById("rapport-owner");
if(el){
    render(<RapportOwner {...el.dataset} />, el)
}

el = document.getElementById("rapport-bien");
if(el){
    render(<RapportBien {...el.dataset} />, el)
}
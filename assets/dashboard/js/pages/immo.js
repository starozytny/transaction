import "../../css/pages/immo.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Agency } from "@dashboardPages/components/Immo/Agencies/Agency";
import { Negotiators } from "@dashboardPages/components/Immo/Negociators/Negotiators";

Routing.setRoutingData(routes);

let el = document.getElementById("agencies");
if(el){
    render(<Agency {...el.dataset} />, el)
}

el = document.getElementById("negotiators");
if(el){
    render(<Negotiators {...el.dataset} />, el)
}
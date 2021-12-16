import "../../css/pages/immo.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Agency } from "@dashboardPages/components/Immo/Agencies/Agency";

Routing.setRoutingData(routes);

let el = document.getElementById("agencies");
if(el){
    render(<Agency {...el.dataset} />, el)
}
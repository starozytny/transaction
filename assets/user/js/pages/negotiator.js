import "../../css/pages/negotiator.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Negotiators } from "@dashboardPages/components/Immo/Negociators/Negotiators";

Routing.setRoutingData(routes);

let el = document.getElementById("list-negotiators");
if(el){
    render(<Negotiators {...el.dataset} perPage={10} isClient={true}  />, el)
}
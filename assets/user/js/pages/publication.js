import "../../css/pages/publication.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Buyers } from "@dashboardPages/components/Immo/Buyers/Buyers";

Routing.setRoutingData(routes);

let el = document.getElementById("list-buyers");
if(el){
    render(<Buyers {...el.dataset} isClient={true} />, el)
}
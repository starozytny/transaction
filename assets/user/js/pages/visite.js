import "../../css/pages/visite.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Prospects } from "@dashboardPages/components/Immo/Prospects/Prospects";

Routing.setRoutingData(routes);

let el = document.getElementById("list-prospects");
if(el){
    render(<Prospects {...el.dataset} isClient={true} />, el)
}
import "../../css/pages/owner.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Owners } from "@dashboardPages/components/Immo/Owners/Owners";

Routing.setRoutingData(routes);

let el = document.getElementById("list-owners");
if(el){
    render(<Owners {...el.dataset} isClient={true}/>, el)
}
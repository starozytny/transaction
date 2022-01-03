import "../../css/pages/tenant.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Tenants } from "@dashboardPages/components/Immo/Tenants/Tenants";

Routing.setRoutingData(routes);

let el = document.getElementById("list-tenants");
if(el){
    render(<Tenants {...el.dataset} isClient={true} />, el)
}
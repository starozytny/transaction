import "../../css/pages/utilities.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Financial } from "@userPages/components/Utilities/Financial";

Routing.setRoutingData(routes);

let el = document.getElementById("utilities-financial");
if(el){
    render(<Financial {...el.dataset} />, el)
}
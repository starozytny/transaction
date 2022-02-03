import "../../css/pages/homepage.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";

import { Visits } from "@userPages/components/Biens/Suivi/Visits";

Routing.setRoutingData(routes);

let el = document.getElementById("visits");
if(el) {
    render(<div className="suivi-global"><Visits visits={JSON.parse(el.dataset.visits)} /></div>, el)
}
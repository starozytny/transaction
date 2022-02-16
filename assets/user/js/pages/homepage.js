import "../../css/pages/homepage.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";

import { Global } from "@userPages/components/Biens/Suivi/Global";

Routing.setRoutingData(routes);

let el = document.getElementById("visits");
if(el) {
    render(<Global visits={JSON.parse(el.dataset.visits)} />, el)
}
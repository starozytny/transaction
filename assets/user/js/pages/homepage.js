import "../../css/pages/homepage.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { LastVisites } from "@userPages/components/Biens/Suivi/Visite/LastVisites";

Routing.setRoutingData(routes);

let el = document.getElementById("visits");
if(el) {
    render(<LastVisites visits={JSON.parse(el.dataset.visits)} maxResults={10} />, el)
}

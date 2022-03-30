import "../../css/pages/homepage.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { LastVisites } from "@userPages/components/Biens/Suivi/Visite/LastVisites";
import { ChartAds } from "@dashboardPages/components/Immo/Stats/Charts";

Routing.setRoutingData(routes);

let el = document.getElementById("visits");
if(el) {
    render(<LastVisites visits={JSON.parse(el.dataset.visits)} maxResults={10} />, el)
}

const chartAd = document.getElementById("chart-ads");
if(chartAd){
    render(<ChartAds donnees={chartAd.dataset.donnees} />, chartAd)
}

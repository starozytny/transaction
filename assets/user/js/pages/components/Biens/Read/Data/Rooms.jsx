import React     from "react";

import helper from "@userPages/components/Biens/functions/helper";

import { RoomItem } from "@userPages/components/Biens/Steps/Step4";

export function Rooms({ rooms }){

    let solItems = helper.getItems("sols");

    return (<div className="details-tab-infos">
        <RoomItem rooms={rooms} solItems={solItems} isFromRead={true}/>
    </div>)
}
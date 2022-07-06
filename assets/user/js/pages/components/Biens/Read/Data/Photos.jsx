import React     from "react";

import { PhotosItem } from "@userPages/components/Biens/Steps/Step8";

export function Photos({ photos }){
    return (<div className="details-tab-infos">
        <PhotosItem isFromRead={true} photos={photos} />
    </div>)
}

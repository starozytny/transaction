import React from "react";

export function PageInfos ({ image, children }) {
    return <div className="page-infos">
        <div className="image">
            <img src={image ? image : "/build/user/images/infos.png"} alt="Illustration page infos"/>
        </div>
        <div className="content">
            {children}
        </div>
    </div>
}
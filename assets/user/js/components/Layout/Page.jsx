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

export function PageInfos2 ({ noImage = false, image, children, actions }) {
    return <div className="content-col-1 page-infos-2-content">
        {!noImage && <div className="page-infos-2-image">
            <img src={image ? image : "/build/user/images/add-prospect.png"} alt="illustration"/>
        </div>}
        <div className="page-infos-2-text">
            {children}
        </div>
        {actions && <div className="page-infos-2-actions">
            {actions}
        </div>}
    </div>
}

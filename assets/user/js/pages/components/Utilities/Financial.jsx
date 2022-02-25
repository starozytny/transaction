import React, { Component } from "react";

import { PageInfos2 } from "@userComponents/Layout/Page";

export class Financial extends Component {
    render () {
        return <div className="main-content">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="content-col-1">
                            <PageInfos2 image="/build/user/images/calcul.png">
                                <p>
                                    Le simulateur de calcul de financement permet d’avoir un aperçu du montant d’un crédit ou le montant
                                    d’une mensualité en fonction de plusieurs variables :
                                    le taux, le montant, la mensualité et la durée de remboursement.
                                </p>
                            </PageInfos2>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div>
                        data
                    </div>
                </div>
            </div>
        </div>
    }
}
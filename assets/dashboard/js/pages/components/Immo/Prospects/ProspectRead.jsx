import React, { Component } from 'react';

import { Button } from "@dashboardComponents/Tools/Button";
import { Back }   from "@dashboardComponents/Layout/Elements";

import { SearchRead }   from "@dashboardPages/components/Immo/Searchs/SearchRead";
import { ReadCard }     from "@userComponents/Layout/Read";

export class ProspectRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <ReadCard elem={elem} onChangeContext={onChangeContext} />

                <div className="item-content-2">
                    {elem.search ? <SearchRead elem={elem.search} follows={[]} prospectId={elem.id}
                                               onUpdateFollows={null} onChangeContext={onChangeContext} />
                        : <Button icon="add-square" onClick={() => onChangeContext('customOne', elem)}>Ajouter une recherche</Button>}
                </div>
            </div>
        </>
    }
}
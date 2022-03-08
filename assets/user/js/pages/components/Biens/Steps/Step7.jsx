import React from "react";

import { Input } from "@dashboardComponents/Tools/Fields";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Alert }        from "@dashboardComponents/Tools/Alert";
import { Aside }        from "@dashboardComponents/Tools/Aside";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import Sanitaze from "@commonComponents/functions/sanitaze";
import Sort     from "@commonComponents/functions/sort";

const CURRENT_STEP = 7;

export function Step7({ step, errors, onNext, onDraft, onChangeLegend, onChangeFile, onSwitchTrashFile,
                          refAside, onOpenAside, onSaveLegend,
                          onDragStart, onDragLeave, onDrop, photo, photos })
{
    photos.sort(Sort.compareRank);
    let contentAside = "";
    if(photo){
        let srcFormPhoto = photo.is64 ? photo.file : photo.photoFile;
        contentAside = <div>
            <div className="line">
                <div className="legend-photo">
                    <img src={srcFormPhoto} alt="Photo to edit"/>
                </div>
            </div>
            <div className="line">
                <Input identifiant="photo" valeur={photo.legend} errors={errors} onChange={(e) => onChangeLegend(e, photo)}>
                    <span>Légende de l'image</span>
                </Input>
            </div>
            <div className="line">
                <Button onClick={onSaveLegend}>Enregistrer</Button>
            </div>
        </div>
    }

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">
                Les photos peuvent avoir un poids maximum de 1Mb  afin de ne pas réduire le temps de chargement. <br/>
                Pour réduire le poids de vos photos, vous pouvez redimensionner
                la taille et/ou utiliser le compresseur en ligne suivant : <a href="https://tinyjpg.com" target="_blank">tinyjpg.com</a>
            </Alert>
        </div>
        <div className="line special-line">
            <div className="form-group">
                <label>Photos</label>
            </div>

            <PhotosItem photos={photos} onSwitchTrashFile={onSwitchTrashFile} onOpenAside={onOpenAside}
                        onDragStart={onDragStart} onDragLeave={onDragLeave} onDrop={onDrop} />

            <div className="line line-3">
                <div className="form-group" />
                <div className="form-group" />
                <Input type="file" identifiant="photos" isMultiple={true} valeur={photos}
                       acceptFiles={"image/*"}
                       errors={errors} onChange={onChangeFile}>
                    <span>Photos</span>
                </Input>
            </div>

            <Aside ref={refAside} content={contentAside}>Légende</Aside>
        </div>

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}

export function PhotosItem({ isFromRead=false, photos, onSwitchTrashFile, onOpenAside, onDragStart, onDragLeave, onDrop }) {
    return <div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-content">
                    <div className="item-body item-body-image">
                        {isFromRead ? <div className="infos infos-col-3">
                            <div className="col-1">Photo</div>
                            <div className="col-2">Ordre</div>
                            <div className="col-3">Taille</div>
                        </div> : <div className="infos infos-col-4">
                            <div className="col-1">Photo</div>
                            <div className="col-2">Ordre</div>
                            <div className="col-3">Taille</div>
                            <div className="col-4 actions">Actions</div>
                        </div>}
                    </div>
                </div>
            </div>
            {(photos && photos.length !== 0) ? photos.map((el, index) => {

                let src = el.is64 ? el.file : el.photoFile;

                return (<div className={"item-drag item" + (el.isTrash ? " trash" : "")}
                             draggable={isFromRead ? "false" : "true"} key={index}
                             onDragStart={isFromRead ? null : (e) => onDragStart(e, el.rank)}
                             onDragOver={(e) => e.preventDefault()}
                             onDragEnter={isFromRead ? null : onDragLeave}
                             onDrop={isFromRead ? null : (e) => onDrop(e, el.rank)}
                >
                    <div className="item-content">
                        <div className="item-body item-body-image">
                            <div className="item-image">
                                <img src={src} alt={el.legend} />
                            </div>
                            <div className={"infos infos-col-" + (isFromRead ? "3" : "4")}>
                                <div className="col-1">
                                    <div className="name name-legend">
                                        {!el.isTrash ?
                                            isFromRead ? <span>{el.legend}</span> : (el.legend ?
                                                <><ButtonIcon icon="pencil" onClick={() => onOpenAside(el)} >Modifier</ButtonIcon><span>{el.legend}</span></>
                                                : <ButtonIcon icon="tag" text="Ajouter une légende" onClick={() => onOpenAside("photo", el)}/>)
                                            : "Supprimée"
                                        }
                                    </div>
                                </div>
                                <div className="col-2">
                                    {el.rank}
                                </div>
                                <div className="col-3">
                                    {Sanitaze.toFormatBytesToSize(el.size)}
                                </div>
                                {!isFromRead && <div className="col-4 actions">
                                    {el.isTrash ? <ButtonIcon icon="refresh" onClick={() => onSwitchTrashFile(el)}>Annuler la suppression</ButtonIcon>
                                        : <ButtonIcon icon="trash" onClick={() => onSwitchTrashFile(el)}>Supprimer</ButtonIcon>}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>)
            }) : <Alert type="reverse">Aucune photo renseignée.</Alert>}
        </div>
    </div>
}

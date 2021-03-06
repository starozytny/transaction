<?php

namespace App\Service\Immo;

use App\Transaction\Entity\Immo\ImAdvert;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImConfidential;
use App\Transaction\Entity\Immo\ImMandat;
use App\Transaction\Entity\Immo\ImPhoto;
use App\Transaction\Entity\Immo\ImPublish;
use App\Transaction\Entity\Immo\ImSupport;
use App\Service\Export;

class PublishService
{
    private $export;

    public function __construct(Export $export)
    {
        $this->export = $export;
    }

    /**
     * @param ImPublish[] $publishes
     * @param ImPhoto[] $photos
     * @return void
     */
    public function createFile(array $publishes, array $photos)
    {
        $data = [];
        foreach($publishes as $publish){
            if($publish->getBien()->getStatus() == ImBien::STATUS_ACTIF){
                switch ($publish->getSupport()->getCode()){
                    case ImSupport::CODE_SELOGER:
                        $data[] = $this->createSeloger($publish->getBien(), $photos);
                        break;
                    default:
                        break;
                }
            }
        }

        $fileName = 'annonces.csv';

        header('Content-Type: application/csv');
        header('Content-Disposition: attachment; filename="'.$fileName.'"');

        $this->export->createFile("csv", 'Liste', $fileName , null, $data, 330, "export/", "!#");
    }

    private function convertBoolean($value): string
    {
        return $value == 99 ? "" : ($value == 1 ? "OUI" : "NON");
    }

    private function setValue($value): string
    {
        $value = str_replace("<br />", "<BR>", $value);
        $value = str_replace('"', "'", $value);
        return '"' . $value . '"';
    }

    /**
     * @param ImBien $bien
     * @param ImPhoto[] $allPhotos
     * @return array
     */
    private function createSeloger(ImBien $bien, array $allPhotos): array
    {
        $agency       = $bien->getAgency();
        $localisation = $bien->getLocalisation();
        $financial    = $bien->getFinancial();
        $area         = $bien->getArea();
        $number       = $bien->getNumber();
        $advert       = $bien->getAdvert();
        $feature      = $bien->getFeature();
        $advantage    = $bien->getAdvantage();
        $mandat       = $bien->getMandat();
        $confidential = $bien->getConfidential();
        $negotiator   = $bien->getNegotiator();
        $diagnostic   = $bien->getDiag();

        $photos = [];
        foreach($allPhotos as $photo){
            if($photo->getBien()->getId() == $bien->getId()){
                $photos[] = $photo;
            }
        }

        $isLocation = $bien->getCodeTypeAd() == ImBien::AD_LOCATION;

        $codeHeater     = $feature->getCodeHeater() + $feature->getCodeHeater0();
        $codeExposition = $feature->getExposition();

        $inform = $confidential->getInform();

        $data = [
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 1 -----------------------------------------
            // ---------------------------------------------------------------------------------
            $agency->getDirname(),
            $bien->getReference(),
            $bien->getTypeAdSeloger(),
            $bien->getTypeBienSeloger(),
            $localisation->getZipcode(),
            $localisation->getCity(),
            $localisation->getCountry(),
            $localisation->getHideAddress() ? "" : $localisation->getAddress(),
            $localisation->getHideAddress() ? "" : $localisation->getQuartier(),
            "", // activit?? commerciales
            $financial->getPrice(),
            "", // cession bail - loyer/mois murs
            "OUI",
            "NON",
            $isLocation ? $financial->getHonoraireTtc() : $financial->getHonorairePourcentage(),
            $area->getHabitable(),
            $area->getLand(),
            $number->getPiece(),
            $number->getRoom(),
            $bien->getLibelle(),
            $advert->getContentFull(),
            $feature->getDispoAt() ? $feature->getDispoAt()->format("d/m/Y") : "",
            $isLocation ? $financial->getChargesMensuelles() : "",
            $feature->getFloor(),
            $feature->getNbFloor(),
            $this->convertBoolean($feature->getIsMeuble()),
            $feature->getBuildAt(),
            $this->convertBoolean($feature->getIsNew()),
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 2 -----------------------------------------
            // ---------------------------------------------------------------------------------
            $number->getBathroom(),
            "", //NB de salles d'eau
            $number->getWc(),
            $this->convertBoolean($feature->getIsWcSeparate()),
            $codeHeater > 0 ? $codeHeater : "",
            $feature->getCodeKitchen(),
            $codeExposition == 99 ? "" : (($codeExposition == 2 || $codeExposition == 6 || $codeExposition == 7) ? "OUI" : "NON"),
            $codeExposition == 99 ? "" : (($codeExposition == 1 || $codeExposition == 4 || $codeExposition == 6) ? "OUI" : "NON"),
            $codeExposition == 99 ? "" : (($codeExposition == 3 || $codeExposition == 5 || $codeExposition == 7) ? "OUI" : "NON"),
            $codeExposition == 99 ? "" : (($codeExposition == 0 || $codeExposition == 4 || $codeExposition == 5) ? "OUI" : "NON"),
            $number->getBalcony(),
            "", //sf balcon ?
            $this->convertBoolean($advantage->getHasLift()),
            $this->convertBoolean($advantage->getHasCave()),
            $number->getParking(),
            $number->getBox(),
            $this->convertBoolean($advantage->getHasDigicode()), // 45
            $this->convertBoolean($advantage->getHasInterphone()),
            $this->convertBoolean($advantage->getHasGuardian()),
            $this->convertBoolean($advantage->getHasTerrace()),
            "",                                   // For locations vacances
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            $advantage->getSituation(),
            "",
            "",
            "",
            $this->convertBoolean($advantage->getHasAlarme()),
            "", //cable TV
            $this->convertBoolean($advantage->getHasCalme()),
            $this->convertBoolean($advantage->getHasClim()),
            $this->convertBoolean($advantage->getHasPool()),
            $this->convertBoolean($advantage->getHasHandi()),
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 3 -----------------------------------------
            // ---------------------------------------------------------------------------------
            "", //animaux accept??s - utile pour la location ?
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "SL",
            $mandat->getCodeTypeMandat() == ImMandat::TYPE_EXCLUSIF ? "OUI" : "NON",
            $advert->getTypeAdvert() == ImAdvert::TYPE_HEART ? "OUI" : "NON",
            isset($photos[0]) ? $photos[0]->getFile() : "",
            isset($photos[1]) ? $photos[1]->getFile() : "",
            isset($photos[2]) ? $photos[2]->getFile() : "",
            isset($photos[3]) ? $photos[3]->getFile() : "",
            isset($photos[4]) ? $photos[4]->getFile() : "",
            isset($photos[5]) ? $photos[5]->getFile() : "",
            isset($photos[6]) ? $photos[6]->getFile() : "",
            isset($photos[7]) ? $photos[7]->getFile() : "",
            isset($photos[8]) ? $photos[8]->getFile() : "",
            isset($photos[0]) ? $photos[0]->getLegend() : "",
            isset($photos[1]) ? $photos[1]->getLegend() : "",
            isset($photos[2]) ? $photos[2]->getLegend() : "",
            isset($photos[3]) ? $photos[3]->getLegend() : "",
            isset($photos[4]) ? $photos[4]->getLegend() : "",
            isset($photos[5]) ? $photos[5]->getLegend() : "",
            isset($photos[6]) ? $photos[6]->getLegend() : "",
            isset($photos[7]) ? $photos[7]->getLegend() : "",
            isset($photos[8]) ? $photos[8]->getLegend() : "",
            "", //photo panoramique
            "", //url visite virtuelle
            $inform == ImConfidential::INFORM_OTHER ? $confidential->getPhone1()    : ($inform == ImConfidential::INFORM_NEGOTIATOR ? ($negotiator->getPhone() ?: $negotiator->getPhone2()) : ""),
            $inform == ImConfidential::INFORM_OTHER ? $confidential->getLastname()  : ($inform == ImConfidential::INFORM_NEGOTIATOR ? $negotiator->getLastname() : ""),
            $inform == ImConfidential::INFORM_OTHER ? $confidential->getEmail()     : ($inform == ImConfidential::INFORM_NEGOTIATOR ? $negotiator->getEmail() : ""),
            $localisation->getZipcode(),
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 4 -----------------------------------------
            // ---------------------------------------------------------------------------------
            $localisation->getCity(),
            "",
            "",
            $mandat->getId(), // TODO : set numero auto
            $mandat->getStartAt() ? $mandat->getStartAt()->format("d/m/Y") : "",
            $mandat->getLastname(), // TODO : add nom, pr??nom et raison sociale du mandataire
            $mandat->getFirstname(),
            $mandat->getRaisonSocial(),
            $mandat->getAddress(),
            $mandat->getZipcode(),
            $mandat->getCity(),
            $mandat->getPhone(),
            $mandat->getCommentary(),
            $confidential->getCommentary(),
            $negotiator->getId(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 5 -----------------------------------------
            // ---------------------------------------------------------------------------------
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            $isLocation ? $financial->getCaution() : "",              // 161
            "", // TODO : add r??cent
            "", // TODO : travaux ?? pr??voir
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            $bien->getIdentifiant(),
            $diagnostic->getDpeValue(),
            $diagnostic->getIsVirgin() ? "VI" : ($diagnostic->getDpeLetterString() ?: (!$diagnostic ->getIsSend() ? "NS" : "")),
            $diagnostic->getGesValue(),
            $diagnostic->getIsVirgin() ? "VI" : ($diagnostic->getGesLetterString() ?: (!$diagnostic ->getIsSend() ? "NS" : "")),
            "",
            $advantage->getSousTypeSeloger(),
            "",
            "",
            "",
            "", // viager
            "",
            "",
            "",
            "",
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 6 -----------------------------------------
            // ---------------------------------------------------------------------------------
            "",
            "", // parquet
            "",
            "",
            "",
            $isLocation ? $financial->getDurationBail() : "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            $area->getLiving(),
            "", //nb vehicule for parking
            "",
            $bien->getCodeTypeAd() == ImBien::AD_PDT_INVEST ? $financial->getPrice() : "",
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 7 -----------------------------------------
            // ---------------------------------------------------------------------------------
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 8 -----------------------------------------
            // ---------------------------------------------------------------------------------
            "", // 255
            "",
            "",
            $this->convertBoolean($financial->getIsCopro()),
            $financial->getIsCopro() ? $financial->getNbLot() : "",
            $financial->getChargesLot(), // TODO : converte to chargesAnnuel
            $this->convertBoolean($financial->getIsSyndicProcedure()),
            $financial->getIsSyndicProcedure() ? $financial->getDetailsProcedure() : "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            // ---------------------------------------------------------------------------------
            // -------------------------------- PAGE 9 -----------------------------------------
            // ---------------------------------------------------------------------------------
            "",
            "",
            "",
            "", // price terrain if construire
            "", // if construire
            "", // if construire
            $localisation->getLat(),
            $localisation->getLon(),
            1,
            "4.10",
            $financial->getHonoraireChargeDe() + 1,
            $financial->getPriceHorsAcquereur(),
            $financial->getTypeCharges() + 1,
            "",
            $financial->getEdl(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            $diagnostic->getCreatedAtDpe() ? $diagnostic->getCreatedAtDpe()->format("d/m/Y") : "",
            $diagnostic->getBeforeJuly() ? "DPE_v01-2011" : "DPE_v07-2021",
            $diagnostic->getMinAnnual(),
            $diagnostic->getMaxAnnual(),
            "01/01/" . $diagnostic->getReferenceDpe(),
            $area->getTerrace(),
            "",
        ];

        $values = [];
        foreach($data as $item){
            $values[] = $this->setValue($item);
        }

        return $values;
    }
}

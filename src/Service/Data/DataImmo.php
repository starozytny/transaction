<?php

namespace App\Service\Data;

use App\Entity\Agenda\AgEvent;
use App\Entity\Immo\ImAdvantage;
use App\Entity\Immo\ImAdvert;
use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImConfidential;
use App\Entity\Immo\ImContract;
use App\Entity\Immo\ImContractant;
use App\Entity\Immo\ImDiag;
use App\Entity\Immo\ImFeature;
use App\Entity\Immo\ImFinancial;
use App\Entity\Immo\ImLocalisation;
use App\Entity\Immo\ImMandat;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImNumber;
use App\Entity\Immo\ImOffer;
use App\Entity\Immo\ImOwner;
use App\Entity\Immo\ImPhoto;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImRoom;
use App\Entity\Immo\ImSearch;
use App\Entity\Immo\ImSettings;
use App\Entity\Immo\ImSuivi;
use App\Entity\Immo\ImSupport;
use App\Entity\Immo\ImTenant;
use App\Entity\Immo\ImVisit;
use App\Entity\Society;
use App\Service\Immo\ImmoService;
use Exception;

class DataImmo extends DataConstructor
{
    private function setToNullFloat($value): ?float
    {
        return $value === "" ? null : (float) $value;
    }
    private function setToNullInteger($value): ?int
    {
        return $value === "" ? null : (int) $value;
    }
    private function setToUnknownEmpty($value): ?int
    {
        return $value !== 99 && $value !== "" ? (int) $value == 1 : ImBien::ANSWER_UNKNOWN;
    }
    private function setToZeroEmpty($value): ?int
    {
        return $value !== 0 && $value !== "" ? (int) $value : ImBien::BUSY_NONE;
    }

    /**
     * @throws Exception
     */
    public function setDataBien(ImAgency $agency, ImBien $obj, $data, ImArea $area,
                                ImNumber $number, ImFeature $feature, ImAdvantage $advantage, ImDiag $diag,
                                ImLocalisation $localisation, ImFinancial $financial, ImConfidential $confidential,
                                ImAdvert $advert, ImMandat $mandat, array $rooms)
    {
        $codeTypeAd     = $data->codeTypeAd;
        $codeTypeBien   = $data->codeTypeBien;
        $libelle        = $data->libelle;
        $negotiator     = $data->negotiator;

        $isDraft = (int) $data->isDraft;
        if($isDraft){
            $obj->setStatus(ImBien::STATUS_DRAFT);
        }

        // validation des données
        if(!$isDraft){
            $paramsToValidate = [
                ['type' => 'text',   'name' => 'codeTypeAd',      'value' => $codeTypeAd],
                ['type' => 'text',   'name' => 'codeTypeBien',    'value' => $codeTypeBien],
                ['type' => 'text',   'name' => 'libelle',         'value' => $libelle],
                ['type' => 'text',   'name' => 'negotiator',      'value' => $negotiator],
                ['type' => 'length', 'name' => 'libelle',         'value' => $libelle, 'min' => 0, 'max' => 64]
            ];
            $noErrors = $this->validator->validateCustom($paramsToValidate);
            if ($noErrors !== true) {
                return $noErrors;
            }
        }

        $negotiator = $this->em->getRepository(ImNegotiator::class)->findOneBy(['id' => $negotiator]);
        if(!$negotiator){
            return [[
                'name' => "negotiator",
                'message' => "Ce négociateur n'existe pas. Si le problème persiste, veuillez contacter le support technique."
            ]];
        }

        if(isset($data->owners) && $data->owners){
            $ownerIds = [];
            foreach($data->owners as $owner){
                if($owner){
                    $ownerIds[] = $owner->id;
                }
            }
            $owners = $this->em->getRepository(ImOwner::class)->findBy(['id' => $ownerIds]);

            $contract = null;
            if($obj->getId()){
                $contract = $this->em->getRepository(ImContract::class)->findOneBy(['bien' => $obj, 'status' => ImContract::STATUS_PROCESSING]);
                $contractants = $this->em->getRepository(ImContractant::class)->findBy(['contract' => $contract]);

                foreach($contractants as $contractant){
                    $this->em->remove($contractant);
                }
            }

            if(!$contract){
                $contract = (new ImContract())
                    ->setBien($obj)
                ;

                $this->em->persist($contract);
            }

            foreach($owners as $owner){
                $contractant = (new ImContractant())
                    ->setContract($contract)
                    ->setOwner($owner)
                ;

                $this->em->persist($contractant);
            }
        }

        foreach($rooms as $room){
            $obj->addRoom($room);
        }

        $agency->setCounter($agency->getCounter() + 1);

        // Création de l'objet
        return ($obj)
            ->setSlug(null)
            ->setCodeTypeAd((int) $codeTypeAd)
            ->setCodeTypeBien((int) $codeTypeBien)
            ->setLibelle($this->sanitizeData->trimData($libelle))
            ->setNegotiator($negotiator)
            ->setArea($area)
            ->setNumber($number)
            ->setFeature($feature)
            ->setAdvantage($advantage)
            ->setDiag($diag)
            ->setLocalisation($localisation)
            ->setFinancial($financial)
            ->setConfidential($confidential)
            ->setAdvert($advert)
            ->setMandat($mandat)
            ->setIsDraft($isDraft)
        ;
    }

    public function setDataSettings(ImSettings $obj, $data): ImSettings
    {
        return ($obj)
            ->setNegotiatorDefault($this->setToZeroEmpty($data->negotiatorDefault))
            ->setMandatMonthVente($this->setToZeroEmpty($data->mandatMonthVente))
            ->setMandatMonthLocation($this->setToZeroEmpty($data->mandatMonthLocation))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataMandat(ImmoService $immoService, ImMandat $obj, $data, ImAgency $agency): ImMandat
    {
        $codeTypeMandat = (int) $data->codeTypeMandat;

        if($data->codeTypeAd == ImBien::AD_VENTE && $codeTypeMandat != ImMandat::TYPE_NONE){
            $obj->setPriceEstimate($this->setToNullFloat($data->priceEstimate));
            $obj->setFee($this->setToNullFloat($data->fee));
        }

        $numero = $obj->getNumero() != null && $obj->getNumero() != 0 ? $obj->getNumero() : 0;
        if($codeTypeMandat != ImMandat::TYPE_NONE){
            if($obj->getNumero() == null || $obj->getNumero() == 0){
                $agency->setCounterMandat($agency->getCounterMandat() + 1);
                $numero = $immoService->getNumeroMandat($agency);
            }

            $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->mandatLastname));
            $firstname = ucfirst($this->sanitizeData->sanitizeString($data->mandatFirstname));

            $obj = ($obj)
                ->setRaisonSocial($this->sanitizeData->trimData($data->mandatRaison))
                ->setLastname($lastname)
                ->setFirstname($firstname)
                ->setPhone($this->sanitizeData->trimData($data->mandatPhone))
                ->setAddress($this->sanitizeData->trimData($data->mandatAddress))
                ->setZipcode($this->sanitizeData->trimData($data->mandatZipcode))
                ->setCity($this->sanitizeData->trimData($data->mandatCity))
                ->setCommentary($this->sanitizeData->trimData($data->mandatCommentary))
            ;
        }

        return ($obj)
            ->setCodeTypeMandat($codeTypeMandat)
            ->setNumero($numero)
            ->setStartAt($this->createDate($data->startAt))
            ->setEndAt($this->createDate($data->endAt))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataArea(ImArea $obj, $data): ImArea
    {
        if((int) $data->caseTypeBien == 1){
            $obj = ($obj)
                ->setLand($this->setToNullFloat($data->areaLand))
                ->setGarden($this->setToNullFloat($data->areaGarden))
                ->setTerrace($this->setToNullFloat($data->areaTerrace))
                ->setCave($this->setToNullFloat($data->areaCave))
                ->setBathroom($this->setToNullFloat($data->areaBathroom))
                ->setLiving($this->setToNullFloat($data->areaLiving))
            ;
        }

        return ($obj)
            ->setTotal((float) $data->areaTotal)
            ->setHabitable($this->setToNullFloat($data->areaHabitable))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataNumber(ImNumber $obj, $data): ImNumber
    {
        if((int) $data->caseTypeBien == 1){
            $obj = ($obj)
                ->setRoom($this->setToNullInteger($data->room))
                ->setBathroom($this->setToNullInteger($data->bathroom))
                ->setWc($this->setToNullInteger($data->wc))
                ->setBalcony($this->setToNullInteger($data->balcony))
                ->setParking($this->setToNullInteger($data->parking))
                ->setBox($this->setToNullInteger($data->box))
            ;
        }

        return ($obj)
            ->setPiece((int) $data->piece)
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataFeature(ImFeature $obj, $data): ImFeature
    {
        $codeTypeBien = (int) $data->codeTypeBien;
        $codeTypeAd = (int) $data->codeTypeAd;

        if($codeTypeAd == ImBien::AD_LOCATION){
            $obj->setIsMeuble($this->setToUnknownEmpty($data->isMeuble));
        }

        if((int) $data->caseTypeBien == 1){
            $obj = ($obj)
                ->setBusy($this->setToZeroEmpty($data->busy))
                ->setFloor($this->setToNullInteger($data->floor))
                ->setNbFloor($this->setToNullInteger($data->nbFloor))
                ->setCodeHeater($this->setToNullInteger($data->codeHeater))
                ->setCodeHeater0($this->setToNullInteger($data->codeHeater0))
                ->setCodeKitchen($this->setToNullInteger($data->codeKitchen))
                ->setCodeWater($this->setToNullInteger($data->codeWater))
                ->setIsWcSeparate($this->setToUnknownEmpty($data->isWcSeparate))
            ;
        }

        if($codeTypeBien != ImBien::BIEN_PARKING_BOX){
            $obj->setExposition($this->setToNullInteger($data->exposition));
        }

        if($codeTypeBien != ImBien::BIEN_TERRAIN){
            $obj = ($obj)
                ->setBuildAt($this->setToNullInteger($data->buildAt))
                ->setIsNew($this->setToUnknownEmpty($data->isNew))
            ;
        }

        if($codeTypeBien == ImBien::BIEN_PARKING_BOX){
            $obj = ($obj)
                ->setNbVehicles($this->setToNullInteger($data->nbVehicles))
                ->setIsImmeubleParking($this->setToUnknownEmpty($data->isImmeubleParking))
                ->setIsParkingIsolate($this->setToUnknownEmpty($data->isParkingIsolate))
            ;
        }

        if($codeTypeAd == ImBien::AD_VIAGER){
            $obj->setAge1($this->setToNullInteger($data->age1));
            $obj->setAge2($this->setToNullInteger($data->age2));
        }

        return ($obj)
            ->setDispoAt($this->createDate($data->dispoAt))
        ;
    }

    public function setDataAdvantage(ImAdvantage $obj, $data): ImAdvantage
    {
        if((int) $data->caseTypeBien == 1){
            $obj = ($obj)
                ->setHasGarden($this->setToUnknownEmpty($data->hasGarden))
                ->setHasTerrace($this->setToUnknownEmpty($data->hasTerrace))
                ->setHasPool($this->setToUnknownEmpty($data->hasPool))
                ->setHasCave($this->setToUnknownEmpty($data->hasCave))
                ->setHasDigicode($this->setToUnknownEmpty($data->hasDigicode))
                ->setHasInterphone($this->setToUnknownEmpty($data->hasInterphone))
                ->setHasGuardian($this->setToUnknownEmpty($data->hasGuardian))
                ->setHasAlarme($this->setToUnknownEmpty($data->hasAlarme))
                ->setHasLift($this->setToUnknownEmpty($data->hasLift))
                ->setHasClim($this->setToUnknownEmpty($data->hasClim))
                ->setHasCalme($this->setToUnknownEmpty($data->hasCalme))
                ->setHasInternet($this->setToUnknownEmpty($data->hasInternet))
                ->setHasHandi($this->setToUnknownEmpty($data->hasHandi))
                ->setHasFibre($this->setToUnknownEmpty($data->hasFibre))
                ->setSituation($this->sanitizeData->trimData($data->situation))
                ->setSousType($this->sanitizeData->trimData($data->sousType))
                ->setSol($this->sanitizeData->trimData($data->sol))
            ;
        }

        return $obj;
    }

    /**
     * @throws Exception
     */
    public function setDataDiag(ImDiag $obj, $data): ImDiag
    {
        if((int) $data->codeTypeBien !== ImBien::BIEN_TERRAIN){
            $obj = ($obj)
                ->setBeforeJuly($this->setToUnknownEmpty($data->beforeJuly))
                ->setIsVirgin($this->setToUnknownEmpty($data->isVirgin))
                ->setIsSend($this->setToUnknownEmpty($data->isSend))
                ->setCreatedAtDpe($this->createDate($data->createdAtDpe))
                ->setReferenceDpe($this->setToNullInteger($data->referenceDpe))
                ->setDpeLetter($this->setToNullInteger($data->dpeLetter))
                ->setGesLetter($this->setToNullInteger($data->gesLetter))
                ->setDpeValue($this->setToNullFloat($data->dpeValue))
                ->setGesValue($this->setToNullFloat($data->gesValue))
                ->setMinAnnual($this->setToNullFloat($data->minAnnual))
                ->setMaxAnnual($this->setToNullFloat($data->maxAnnual))
            ;
        }

        return $obj;
    }

    public function setDataLocalisation(ImLocalisation $obj, $data): ImLocalisation
    {
        return ($obj)
            ->setHideAddress($data->hideAddress)
            ->setHideMap($data->hideMap)
            ->setAddress($this->sanitizeData->trimData($data->address))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setCountry($this->sanitizeData->trimData($data->country))
            ->setDepartement($this->sanitizeData->trimData($data->departement))
            ->setQuartier($this->sanitizeData->trimData($data->quartier))
            ->setLat((float) $data->lat)
            ->setLon((float) $data->lon)
        ;
    }

    public function setDataFinancial(ImFinancial $obj, $data): ImFinancial
    {
        $codeTypeAd = (int) $data->codeTypeAd;
        if($codeTypeAd == ImBien::AD_LOCATION || $codeTypeAd == ImBien::AD_LOCATION_VAC || $codeTypeAd == ImBien::AD_CESSION_BAIL ){
            $obj = ($obj)
                ->setProvisionCharges($this->setToNullFloat($data->provisionCharges))
                ->setTypeCharges($this->setToNullInteger($data->typeCharges))
                ->setCaution($this->setToNullFloat($data->caution))
                ->setEdl($this->setToNullFloat($data->edl))
                ->setTypeBail($this->setToZeroEmpty($data->typeBail))
                ->setDurationBail($this->setToNullFloat($data->durationBail))
                ->setComplementLoyer($this->setToNullFloat($data->complementLoyer))
                ->setPriceHt($this->setToNullFloat($data->priceHt))
                ->setPricePlafond($this->setToNullFloat($data->pricePlafond))
            ;

            if($codeTypeAd == ImBien::AD_CESSION_BAIL){
                $obj->setPriceMurs($this->setToNullFloat($data->priceMurs));
            }

        }else{
            $obj = ($obj)
                ->setHonoraireChargeDe($this->setToNullInteger($data->honoraireChargeDe))
                ->setHonorairePourcentage($this->setToNullFloat($data->honorairePourcentage))
                ->setPriceHorsAcquereur($this->setToNullFloat($data->priceHorsAcquereur))
                ->setChargesMensuelles($this->setToNullFloat($data->chargesMensuelles))
                ->setNotaire($this->setToNullFloat($data->notaire))
                ->setFoncier($this->setToNullFloat($data->foncier))
                ->setTaxeHabitation($this->setToNullFloat($data->taxeHabitation))
                ->setIsCopro($data->isCopro)
                ->setIsSyndicProcedure($data->isSyndicProcedure)
            ;

            if($data->isCopro){
                $obj = ($obj)
                    ->setNbLot($this->setToNullFloat($data->nbLot))
                    ->setChargesLot($this->setToNullFloat($data->chargesLot))
                ;
            }

            if($data->isSyndicProcedure){
                $obj = ($obj)
                    ->setDetailsProcedure($this->sanitizeData->sanitizeString($data->detailsProcedure))
                ;
            }

            if($codeTypeAd == ImBien::AD_VIAGER){
                $obj->setRente($this->setToNullFloat($data->rente));
            }

            if($codeTypeAd == ImBien::AD_FOND_COMMERCE){
                $obj = ($obj)
                    ->setRepartitionCa($this->sanitizeData->trimData($data->repartitionCa))
                    ->setNatureBailCommercial($this->sanitizeData->trimData($data->natureBailCommercial))
                    ->setResultatN0($this->setToNullInteger($data->resultatN0))
                    ->setResultatN1($this->setToNullInteger($data->resultatN1))
                    ->setResultatN2($this->setToNullInteger($data->resultatN2))
                ;
            }
        }

        return ($obj)
            ->setPrice((float) $data->price)
            ->setTotalGeneral($this->setToNullFloat($data->totalGeneral))
            ->setHonoraireTtc($this->setToNullFloat($data->honoraireTtc))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataConfidential(ImConfidential $obj, $data): ImConfidential
    {
        $inform = $this->setToZeroEmpty($data->inform);
        if($inform == 3){
            $obj = ($obj)
                ->setLastname($this->sanitizeData->sanitizeString($data->lastname))
                ->setPhone1($this->sanitizeData->trimData($data->phone1))
                ->setEmail($this->sanitizeData->trimData($data->email))
            ;
        }

        return ($obj)
            ->setInform($inform)
            ->setVisiteAt($this->createDate($data->visiteAt))
            ->setKeysNumber($this->setToNullInteger($data->keysNumber))
            ->setKeysWhere($this->sanitizeData->trimData($data->keysWhere))
        ;
    }

    public function setDataAdvert(ImAdvert $obj, $data): ImAdvert
    {
        return ($obj)
            ->setTypeAdvert($this->setToZeroEmpty($data->typeAdvert))
            ->setContentSimple($this->sanitizeData->trimData($data->contentSimple))
            ->setContentFull($data->contentFull ? $this->sanitizeData->trimData($data->contentFull) : "")
        ;
    }

    public function setDataRooms($data, $rooms): array
    {
        foreach ($rooms as $room){
            $this->em->remove($room);
        }

        $tab = [];
        if(is_array($data->rooms)){
            foreach($data->rooms as $room){
                $new = $this->setDataRoom($room);

                $this->em->persist($new);
                $tab[] = $new;
            }
        }

        return $tab;
    }

    private function setDataRoom($data): ImRoom
    {
        return (new ImRoom())
            ->setUid($data->uid)
            ->setTypeRoom((int) $data->typeRoom)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setArea($this->setToNullFloat($data->area))
            ->setSol($this->sanitizeData->trimData($data->sol))
            ->setHasBalcony((int) $data->hasBalcony)
            ->setHasTerrace((int) $data->hasTerrace)
            ->setHasGarden((int) $data->hasGarden)
            ->setAreaBalcony($this->setToNullFloat($data->areaBalcony))
            ->setAreaTerrace($this->setToNullFloat($data->areaTerrace))
            ->setAreaGarden($this->setToNullFloat($data->areaGarden))
        ;
    }

    public function setDataPhoto(ImPhoto $obj, $data, $fileName, ImAgency $agency): ImPhoto
    {
        return ($obj)
            ->setUid($data->uid)
            ->setLegend($this->sanitizeData->trimData($data->legend))
            ->setRank((int) $data->rank)
            ->setSize($this->setToNullFloat($data->size))
            ->setFile($fileName)
            ->setAgency($agency)
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataAgency(ImAgency $obj, $data): ImAgency
    {
        $society = $this->em->getRepository(Society::class)->find($data->society);
        if(!$society){
            throw new Exception("Société introuvable.");
        }

        $name = $this->sanitizeData->sanitizeString($data->name);

        $i = 0;
        $code = mb_strtoupper(substr($name, 0, 2)) . $i;
        do{
            $existe = $this->em->getRepository(ImAgency::class)->findOneBy(['code' => $code]);
            if($existe){
                $code .= $i++;
            }
        }while($existe);

        return ($obj)
            ->setSociety($society)
            ->setName($name)
            ->setCode($code)
            ->setDirname($this->sanitizeData->sanitizeString($data->dirname))
            ->setWebsite($this->sanitizeData->sanitizeString($data->website))
            ->setEmail($this->sanitizeData->trimData($data->email))
            ->setEmailLocation($this->sanitizeData->trimData($data->emailLocation))
            ->setEmailVente($this->sanitizeData->trimData($data->emailVente))
            ->setPhone($this->sanitizeData->trimData($data->phone))
            ->setPhoneLocation($this->sanitizeData->trimData($data->phoneLocation))
            ->setPhoneVente($this->sanitizeData->trimData($data->phoneVente))
            ->setAddress($this->sanitizeData->trimData($data->address))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setLat($this->sanitizeData->trimData($data->lat))
            ->setLon($this->sanitizeData->trimData($data->lon))
            ->setIdentifiant($this->sanitizeData->sanitizeString($data->dirname))
            ->setDescription($this->sanitizeData->trimData($data->description->html))
            ->setType($this->sanitizeData->trimData($data->type))
            ->setSiret($this->sanitizeData->trimData($data->siret))
            ->setRcs($this->sanitizeData->trimData($data->rcs))
            ->setCartePro($this->sanitizeData->trimData($data->cartePro))
            ->setGarantie($this->sanitizeData->trimData($data->garantie))
            ->setAffiliation($this->sanitizeData->trimData($data->affiliation))
            ->setMediation($this->sanitizeData->trimData($data->mediation))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataNegotiator(ImNegotiator $obj, $data): ImNegotiator
    {
        $agency = $this->em->getRepository(ImAgency::class)->find($data->agency);
        if(!$agency){
            throw new Exception("Agence introuvable.");
        }

        $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname));
        $firstname = ucfirst($this->sanitizeData->sanitizeString($data->firstname));
        $code = mb_strtoupper(substr($lastname, 0, 1) . substr($firstname, 0, 1));

        return ($obj)
            ->setAgency($agency)
            ->setCode($code)
            ->setLastname($lastname)
            ->setFirstname($firstname)
            ->setEmail($this->sanitizeData->trimData($data->email))
            ->setPhone($this->sanitizeData->trimData($data->phone))
            ->setPhone2($this->sanitizeData->trimData($data->phone2))
            ->setTransport((int) $data->transport)
            ->setImmatriculation($this->sanitizeData->trimData($data->immatriculation))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataOwner(ImOwner $obj, $data): ImOwner
    {
        $agency = $this->em->getRepository(ImAgency::class)->find($data->agency);
        if(!$agency){
            throw new Exception("Agence introuvable.");
        }

        $society = $agency->getSociety();
        if(!$society){
            throw new Exception("Société introuvable.");
        }

        dump($data);

        $negotiator = $data->negotiator ? $this->em->getRepository(ImNegotiator::class)->find($data->negotiator) : null;

        $civility = (int) $data->civility;
        $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname));
        $firstname = ucfirst($this->sanitizeData->sanitizeString($data->firstname));
        $code = mb_strtoupper(substr($lastname, 0, 1) . substr($firstname, 0, 1)) . time();

        return ($obj)
            ->setSociety($society)
            ->setAgency($agency)
            ->setNegotiator($negotiator)
            ->setCode($code)
            ->setLastname($lastname)
            ->setFirstname($civility != 2 ? $firstname : null)
            ->setCivility($civility)
            ->setEmail($this->sanitizeData->trimData($data->email))
            ->setPhone1($this->sanitizeData->trimData($data->phone1))
            ->setPhone2($this->sanitizeData->trimData($data->phone2))
            ->setPhone3($this->sanitizeData->trimData($data->phone3))
            ->setAddress($this->sanitizeData->trimData($data->address))
            ->setComplement($this->sanitizeData->trimData($data->complement))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setCountry($this->sanitizeData->trimData($data->country))
            ->setCategory($this->setToNullInteger($data->category))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataTenant(ImTenant $obj, $data): ImTenant
    {
        $agency = $this->em->getRepository(ImAgency::class)->find($data->agency);
        if(!$agency){
            throw new Exception("Agence introuvable.");
        }
        $negotiator = null;
        if($data->negotiator){
            $negotiator = $this->em->getRepository(ImNegotiator::class)->find($data->negotiator);
        }

        $civility = (int) $data->civility;
        $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname));
        $firstname = ucfirst($this->sanitizeData->sanitizeString($data->firstname));

        return ($obj)
            ->setAgency($agency)
            ->setNegotiator($negotiator)
            ->setLastname($lastname)
            ->setFirstname($civility != 2 ? $firstname : null)
            ->setCivility($civility)
            ->setEmail($this->sanitizeData->trimData($data->email))
            ->setPhone1($this->sanitizeData->trimData($data->phone1))
            ->setPhone2($this->sanitizeData->trimData($data->phone2))
            ->setPhone3($this->sanitizeData->trimData($data->phone3))
            ->setAddress($this->sanitizeData->trimData($data->address))
            ->setComplement($this->sanitizeData->trimData($data->complement))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setCountry($this->sanitizeData->trimData($data->country))
            ->setBirthday($this->createDate($data->birthday))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataProspect(ImProspect $obj, $data): ImProspect
    {
        $agency = $this->em->getRepository(ImAgency::class)->find($data->agency);
        if(!$agency){
            throw new Exception("Agence introuvable.");
        }
        $negotiator = $this->em->getRepository(ImNegotiator::class)->find($data->negotiator);

        $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname));
        $firstname = ucfirst($this->sanitizeData->sanitizeString($data->firstname));

        return ($obj)
            ->setAgency($agency)
            ->setNegotiator($negotiator)
            ->setLastname($lastname)
            ->setFirstname($firstname)
            ->setCivility((int) $data->civility)
            ->setEmail($this->sanitizeData->trimData($data->email))
            ->setPhone1($this->sanitizeData->trimData($data->phone1))
            ->setPhone2($this->sanitizeData->trimData($data->phone2))
            ->setPhone3($this->sanitizeData->trimData($data->phone3))
            ->setAddress($this->sanitizeData->trimData($data->address))
            ->setComplement($this->sanitizeData->trimData($data->complement))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setBirthday($this->createDate($data->birthday))
            ->setLastContactAt($this->createDate($data->lastContactAt))
            ->setType((int) $data->type)
            ->setStatus((int) $data->status)
            ->setCommentary($this->sanitizeData->trimData($data->commentary))
        ;
    }

    public function setDataVisit(ImVisit $obj, AgEvent $event, ImBien $bien): ImVisit
    {
        return ($obj)
            ->setAgEvent($event)
            ->setBien($bien)
        ;
    }

    public function setDataSuivi(ImSuivi $obj, ImBien $bien, ImProspect $prospect): ImSuivi
    {
        return ($obj)
            ->setBien($bien)
            ->setProspect($prospect)
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataSearch(ImSearch $obj, $data): ImSearch
    {
        $prospect = null;
        if($data->prospectId){
            $prospect = $this->em->getRepository(ImProspect::class)->find($data->prospectId);
            if(!$prospect){
                throw new Exception("Prospect introuvable.");
            }

            $prospect->setStatus(ImProspect::STATUS_SEARCH);
        }

        return ($obj)
            ->setProspect($prospect)
            ->setCodeTypeAd($this->setToNullInteger($data->codeTypeAd))
            ->setCodeTypeBien($this->setToNullInteger($data->codeTypeBien))
            ->setMinPrice($this->setToNullFloat($data->minPrice))
            ->setMaxPrice($this->setToNullFloat($data->maxPrice))
            ->setMinPiece($this->setToNullFloat($data->minPiece))
            ->setMaxPiece($this->setToNullFloat($data->maxPiece))
            ->setMinRoom($this->setToNullFloat($data->minRoom))
            ->setMaxRoom($this->setToNullFloat($data->maxRoom))
            ->setMinArea($this->setToNullFloat($data->minArea))
            ->setMaxArea($this->setToNullFloat($data->maxArea))
            ->setMinLand($this->setToNullFloat($data->minLand))
            ->setMaxLand($this->setToNullFloat($data->maxLand))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setHasLift($this->setToNullInteger($data->hasLift))
            ->setHasTerrace($this->setToNullInteger($data->hasTerrace))
            ->setHasBalcony($this->setToNullInteger($data->hasBalcony))
            ->setHasParking($this->setToNullInteger($data->hasParking))
            ->setHasBox($this->setToNullInteger($data->hasBox))
        ;
    }

    public function setDataOffer(ImOffer $obj, $data): ImOffer
    {
        return ($obj)
            ->setPricePropal($this->setToNullFloat($data->pricePropal))
        ;
    }

    public function setDataOfferFinal(ImOffer $obj, $data): ImOffer
    {
        return ($obj)
            ->setPriceFinal($this->setToNullFloat($data->priceFinal))
            ->setStatus(ImOffer::STATUS_ACCEPT)
        ;
    }

    public function setDataSupport(ImSupport $obj, $data): ImSupport
    {
        return ($obj)
            ->setCode((int) $data->code)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setFtpServer($this->sanitizeData->trimData($data->ftpServer))
            ->setFtpPort($this->setToNullInteger($data->ftpPort))
            ->setFtpUser($this->sanitizeData->trimData($data->ftpUser))
            ->setFtpPassword($this->sanitizeData->trimData($data->ftpPassword))
            ->setMaxPhotos($this->setToZeroEmpty($data->maxPhotos))
            ->setFilename($this->sanitizeData->trimData($data->filename))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataContract(ImContract $obj, $data, ImBien $bien): ImContract
    {
        return ($obj)
            ->setBien($bien)
            ->setSellAt($this->sanitizeData->createDate($data->sellAt))
            ->setSellBy($this->setToZeroEmpty($data->sellBy))
            ->setSellWhy($this->setToZeroEmpty($data->sellWhy))
        ;
    }
}

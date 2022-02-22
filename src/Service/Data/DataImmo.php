<?php

namespace App\Service\Data;

use App\Entity\Agenda\AgEvent;
use App\Entity\Immo\ImAdvantage;
use App\Entity\Immo\ImAdvert;
use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImBuyer;
use App\Entity\Immo\ImConfidential;
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
    public function setDataBien(ImBien $obj, $data, ImArea $area, ImNumber $number, ImFeature $feature,
                                ImAdvantage $advantage, ImDiag $diag, ImLocalisation $localisation,
                                ImFinancial $financial, ImConfidential $confidential, ImAdvert $advert,
                                ImMandat $mandat, array $rooms)
    {
        $codeTypeAd     = $data->codeTypeAd;
        $codeTypeBien   = $data->codeTypeBien;
        $libelle        = $data->libelle;
        $negotiator     = $data->negotiator;

        // validation des données
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

        $negotiator = $this->em->getRepository(ImNegotiator::class)->findOneBy(['id' => $negotiator]);
        if(!$negotiator){
            return [[
                'name' => "negotiator",
                'message' => "Ce négociateur n'existe pas. Si le problème persiste, veuillez contacter le support technique."
            ]];
        }

        $owner = null;
        if(isset($data->owner) && $data->owner){
            $owner = $this->em->getRepository(ImOwner::class)->findOneBy(['id' => $data->owner]);
            if(!$owner){
                return ['message' => 'Un problème est survenue au niveau du propriétaire.'];
            }
        }

        $isDraft = (int) $data->isDraft;
        if($isDraft){
            $obj->setStatus(ImBien::STATUS_DRAFT);
        }

        foreach($rooms as $room){
            $obj->addRoom($room);
        }

        // Création de l'objet
        return ($obj)
            ->setSlug(null)
            ->setCodeTypeAd((int) $codeTypeAd)
            ->setCodeTypeBien((int) $codeTypeBien)
            ->setLibelle($this->sanitizeData->trimData($libelle))
            ->setNegotiator($negotiator)
            ->setReference(substr(mb_strtoupper(uniqid().bin2hex(random_bytes(1))), 0, 10).random_int(100,999))
            ->setArea($area)
            ->setNumber($number)
            ->setFeature($feature)
            ->setAdvantage($advantage)
            ->setDiag($diag)
            ->setLocalisation($localisation)
            ->setFinancial($financial)
            ->setOwner($owner)
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
    public function setDataMandat(ImMandat $obj, $data): ImMandat
    {

        if($data->codeTypeAd == ImBien::AD_VENTE && $data->codeTypeMandat != ImMandat::TYPE_NONE){
            $obj->setPriceEstimate($this->setToNullFloat($data->priceEstimate));
            $obj->setFee($this->setToNullFloat($data->fee));
        }

        return ($obj)
            ->setCodeTypeMandat((int) $data->codeTypeMandat)
            ->setStartAt($this->createDate($data->startAt))
            ->setEndAt($this->createDate($data->endAt))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataArea(ImArea $obj, $data): ImArea
    {
        // Création de l'objet
        return ($obj)
            ->setTotal((float) $data->areaTotal)
            ->setHabitable($this->setToNullFloat($data->areaHabitable))
            ->setLand($this->setToNullFloat($data->areaLand))
            ->setGarden($this->setToNullFloat($data->areaGarden))
            ->setTerrace($this->setToNullFloat($data->areaTerrace))
            ->setCave($this->setToNullFloat($data->areaCave))
            ->setBathroom($this->setToNullFloat($data->areaBathroom))
            ->setLiving($this->setToNullFloat($data->areaLiving))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataNumber(ImNumber $obj, $data): ImNumber
    {
        // Création de l'objet
        return ($obj)
            ->setPiece((int) $data->piece)
            ->setRoom($this->setToNullInteger($data->room))
            ->setBathroom($this->setToNullInteger($data->bathroom))
            ->setWc($this->setToNullInteger($data->wc))
            ->setBalcony($this->setToNullInteger($data->balcony))
            ->setParking($this->setToNullInteger($data->parking))
            ->setBox($this->setToNullInteger($data->box))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataFeature(ImFeature $obj, $data): ImFeature
    {
        return ($obj)
            ->setIsMeuble($this->setToUnknownEmpty($data->isMeuble))
            ->setIsNew($this->setToUnknownEmpty($data->isNew))
            ->setDispoAt($this->createDate($data->dispoAt))
            ->setBusy($this->setToZeroEmpty($data->busy))
            ->setBuildAt($this->setToNullInteger($data->buildAt))
            ->setFloor($this->setToNullInteger($data->floor))
            ->setNbFloor($this->setToNullInteger($data->nbFloor))
            ->setCodeHeater($this->setToNullInteger($data->codeHeater))
            ->setCodeHeater0($this->setToNullInteger($data->codeHeater0))
            ->setCodeKitchen($this->setToNullInteger($data->codeKitchen))
            ->setCodeWater($this->setToNullInteger($data->codeWater))
            ->setIsWcSeparate($this->setToUnknownEmpty($data->isWcSeparate))
            ->setExposition($this->setToNullInteger($data->exposition))
        ;
    }

    public function setDataAdvantage(ImAdvantage $obj, $data): ImAdvantage
    {
        return ($obj)
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

    /**
     * @throws Exception
     */
    public function setDataDiag(ImDiag $obj, $data): ImDiag
    {
        return ($obj)
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
        return ($obj)
            ->setPrice((float) $data->price)
            ->setProvisionCharges($this->setToNullFloat($data->provisionCharges))
            ->setProvisionOrdures($this->setToNullFloat($data->provisionOrdures))
            ->setTva($this->setToNullFloat($data->tva))
            ->setTotalTerme($this->setToNullFloat($data->totalTerme))
            ->setCaution($this->setToNullFloat($data->caution))
            ->setHonoraireTtc($this->setToNullFloat($data->honoraireTtc))
            ->setHonoraireBail($this->setToNullFloat($data->honoraireBail))
            ->setEdl($this->setToNullFloat($data->edl))
            ->setTypeCalcul($this->setToNullInteger($data->typeCalcul))
            ->setTypeCharges($this->setToNullInteger($data->typeCharges))
            ->setTotalGeneral($this->setToNullFloat($data->totalGeneral))
            ->setTypeBail($this->setToZeroEmpty($data->typeBail))
            ->setDurationBail($this->setToNullFloat($data->durationBail))
            ->setChargesMensuelles($this->setToNullFloat($data->chargesMensuelles))
            ->setNotaire($this->setToNullFloat($data->notaire))
            ->setFoncier($this->setToNullFloat($data->foncier))
            ->setTaxeHabitation($this->setToNullFloat($data->taxeHabitation))
            ->setHonoraireChargeDe($this->setToNullInteger($data->honoraireChargeDe))
            ->setHonorairePourcentage($this->setToNullFloat($data->honorairePourcentage))
            ->setPriceHorsAcquereur($this->setToNullFloat($data->priceHorsAcquereur))
            ->setIsCopro($data->isCopro)
            ->setNbLot($this->setToNullFloat($data->nbLot))
            ->setChargesLot($this->setToNullFloat($data->chargesLot))
            ->setIsSyndicProcedure($data->isSyndicProcedure)
            ->setDetailsProcedure($this->sanitizeData->sanitizeString($data->detailsProcedure))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataConfidential(ImConfidential $obj, $data): ImConfidential
    {
        return ($obj)
            ->setInform($this->setToZeroEmpty($data->inform))
            ->setLastname($this->sanitizeData->sanitizeString($data->lastname))
            ->setPhone1($this->sanitizeData->trimData($data->phone1))
            ->setEmail($this->sanitizeData->trimData($data->email))
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

        return ($obj)
            ->setSociety($society)
            ->setName($this->sanitizeData->sanitizeString($data->name))
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
        $society = $this->em->getRepository(Society::class)->find($data->society);
        if(!$society){
            throw new Exception("Société introuvable.");
        }
        $agency = $this->em->getRepository(ImAgency::class)->find($data->agency);
        if(!$agency){
            throw new Exception("Agence introuvable.");
        }
        $negotiator = $this->em->getRepository(ImNegotiator::class)->find($data->negotiator);

        $civility = (int) $data->civility;
        $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname));
        $firstname = ucfirst($this->sanitizeData->sanitizeString($data->firstname));
        $code = mb_strtoupper(substr($lastname, 0, 1) . substr($firstname, 0, 1)) . time();

        $isCoIndivisaire = $this->setToNullInteger($data->isCoIndivisaire);

        if($isCoIndivisaire){
            $obj = ($obj)
                ->setCoLastname(mb_strtoupper($this->sanitizeData->sanitizeString($data->coLastname)))
                ->setCoFirstname(ucfirst($this->sanitizeData->sanitizeString($data->coFirstname)))
                ->setCoEmail($this->sanitizeData->trimData($data->coEmail))
                ->setCoPhone($this->sanitizeData->trimData($data->coPhone))
                ->setCoAddress($this->sanitizeData->trimData($data->coAddress))
                ->setCoZipcode($this->sanitizeData->trimData($data->zipcode))
                ->setCoCity($this->sanitizeData->trimData($data->city))
            ;
        }

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
            ->setIsCoIndivisaire($isCoIndivisaire)
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
        $negotiator = $this->em->getRepository(ImNegotiator::class)->find($data->negotiator);

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
    public function setDataBuyer(ImBuyer $obj, $data): ImBuyer
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
            ->setType((int) $data->type)
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
}
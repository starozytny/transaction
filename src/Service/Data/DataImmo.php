<?php

namespace App\Service\Data;

use App\Entity\Immo\ImAdvantage;
use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImDiag;
use App\Entity\Immo\ImFeature;
use App\Entity\Immo\ImFinancial;
use App\Entity\Immo\ImLocalisation;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImNumber;
use App\Entity\Immo\ImOwner;
use App\Entity\Society;
use Exception;

class DataImmo extends DataConstructor
{
    private function setToNullFloat($value): ?float
    {
        return $value != "" ? (float) $value : null;
    }
    private function setToNullInteger($value): ?int
    {
        return $value != "" ? (int) $value : null;
    }

    /**
     * @throws Exception
     */
    public function setDataBien(ImBien $obj, $data, ImArea $area, ImNumber $number, ImFeature $feature,
                                ImAdvantage $advantage, ImDiag $diag, ImLocalisation $localisation, ImFinancial $financial)
    {
        $codeTypeAd     = $data->codeTypeAd;
        $codeTypeBien   = $data->codeTypeBien;
        $libelle        = $data->libelle;
        $codeTypeMandat = $data->codeTypeMandat;
        $negotiator     = $data->negotiator;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',   'name' => 'codeTypeAd',      'value' => $codeTypeAd],
            ['type' => 'text',   'name' => 'codeTypeBien',    'value' => $codeTypeBien],
            ['type' => 'text',   'name' => 'libelle',         'value' => $libelle],
            ['type' => 'text',   'name' => 'codeTypeMandat',  'value' => $codeTypeMandat],
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

        // Création de l'objet
        return ($obj)
            ->setSlug(null)
            ->setCodeTypeAd((int) $codeTypeAd)
            ->setCodeTypeBien((int) $codeTypeBien)
            ->setLibelle(trim($libelle))
            ->setCodeTypeMandat((int) $codeTypeMandat)
            ->setNegotiator($negotiator)
            ->setReference(substr(mb_strtoupper(uniqid().bin2hex(random_bytes(1))), 0, 10))
            ->setArea($area)
            ->setNumber($number)
            ->setFeature($feature)
            ->setAdvantage($advantage)
            ->setDiag($diag)
            ->setLocalisation($localisation)
            ->setFinancial($financial)
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataArea(ImArea $obj, $data)
    {
        $paramsToValidate = [
            ['type' => 'text', 'name' => 'areaTotal', 'value' => $data->areaTotal],
        ];
        $noErrors = $this->validator->validateCustom($paramsToValidate);
        if ($noErrors !== true) {
            return $noErrors;
        }

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
            ->setDining($this->setToNullFloat($data->areaDining))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataNumber(ImNumber $obj, $data)
    {
        $paramsToValidate = [
            ['type' => 'text', 'name' => 'piece',  'value' => $data->piece],
        ];
        $noErrors = $this->validator->validateCustom($paramsToValidate);
        if ($noErrors !== true) {
            return $noErrors;
        }

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
            ->setIsMeuble($this->setToNullInteger($data->isMeuble))
            ->setIsNew($this->setToNullInteger($data->isNew))
            ->setDispoAt($this->createDate($data->dispoAt))
            ->setBuildAt($this->setToNullInteger($data->buildAt))
            ->setFloor(trim($data->floor))
            ->setNbFloor($this->setToNullInteger($data->nbFloor))
            ->setCodeHeater($this->setToNullInteger($data->codeHeater))
            ->setCodeHeater0($this->setToNullInteger($data->codeHeater0))
            ->setCodeKitchen($this->setToNullInteger($data->codeKitchen))
            ->setIsWcSeparate($this->setToNullInteger($data->isWcSeparate))
            ->setExposition($this->setToNullInteger($data->exposition))
        ;
    }

    public function setDataAdvantage(ImAdvantage $obj, $data): ImAdvantage
    {
        return ($obj)
            ->setHasGarden($this->setToNullInteger($data->hasGarden))
            ->setHasTerrace($this->setToNullInteger($data->hasTerrace))
            ->setHasPool($this->setToNullInteger($data->hasPool))
            ->setHasCave($this->setToNullInteger($data->hasCave))
            ->setHasDigicode($this->setToNullInteger($data->hasDigicode))
            ->setHasInterphone($this->setToNullInteger($data->hasInterphone))
            ->setHasGuardian($this->setToNullInteger($data->hasGuardian))
            ->setHasAlarme($this->setToNullInteger($data->hasAlarme))
            ->setHasLift($this->setToNullInteger($data->hasLift))
            ->setHasClim($this->setToNullInteger($data->hasClim))
            ->setHasCalme($this->setToNullInteger($data->hasCalme))
            ->setHasInternet($this->setToNullInteger($data->hasInternet))
            ->setHasHandi($this->setToNullInteger($data->hasHandi))
            ->setHasFibre($this->setToNullInteger($data->hasFibre))
            ->setSituation(trim($data->situation))
            ->setSousType($this->setToNullInteger($data->sousType))
            ->setSol($this->setToNullInteger($data->sol))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataDiag(ImDiag $obj, $data): ImDiag
    {
        return ($obj)
            ->setBeforeJuly($this->setToNullInteger($data->beforeJuly))
            ->setIsVirgin($this->setToNullInteger($data->isVirgin))
            ->setIsSend($this->setToNullInteger($data->isSend))
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
            ->setHideAddress($this->setToNullInteger($data->hideAddress))
            ->setHideMap($this->setToNullInteger($data->hideMap))
            ->setAddress(trim($data->address))
            ->setZipcode(trim($data->zipcode))
            ->setCity(trim($data->city))
            ->setCountry(trim($data->country))
            ->setDepartement(trim($data->departement))
            ->setQuartier(trim($data->quartier))
            ->setLat(trim($data->lat))
            ->setLon(trim($data->lon))
        ;
    }

    public function setDataFinancial(ImFinancial $obj, $data): ImFinancial
    {
        return ($obj)
            ->setTypeCalcul($this->setToNullInteger($data->typeCalcul))
            ->setPrice($this->setToNullFloat($data->price))
            ->setProvisionCharges($this->setToNullFloat($data->provisionCharges))
            ->setProvisionOrdures($this->setToNullFloat($data->provisionOrdures))
            ->setTva($this->setToNullFloat($data->tva))
            ->setTotalTerme($this->setToNullFloat($data->totalTerme))
            ->setCaution($this->setToNullFloat($data->caution))
            ->setHonoraireTtc($this->setToNullFloat($data->honoraireTtc))
            ->setHonoraireBail($this->setToNullFloat($data->honoraireBail))
            ->setEdl($this->setToNullFloat($data->Edl))
            ->setTypeCalcul($this->setToNullInteger($data->typeCalcul))
            ->setTotalGeneral($this->setToNullFloat($data->totalGeneral))
            ->setTypeBail($this->setToNullInteger($data->typeBail))
            ->setDurationBail($this->setToNullFloat($data->durationBail))
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
            ->setEmail(trim($data->email))
            ->setEmailLocation(trim($data->emailLocation))
            ->setEmailVente(trim($data->emailVente))
            ->setPhone(trim($data->phone))
            ->setPhoneLocation(trim($data->phoneLocation))
            ->setPhoneVente(trim($data->phoneVente))
            ->setAddress(trim($data->address))
            ->setZipcode(trim($data->zipcode))
            ->setCity(trim($data->city))
            ->setLat(trim($data->lat))
            ->setLon(trim($data->lon))
            ->setIdentifiant($this->sanitizeData->sanitizeString($data->dirname))
            ->setDescription(trim($data->description->html))
            ->setType(trim($data->type))
            ->setSiret(trim($data->siret))
            ->setRcs(trim($data->rcs))
            ->setCartePro(trim($data->cartePro))
            ->setGarantie(trim($data->garantie))
            ->setAffiliation(trim($data->affiliation))
            ->setMediation(trim($data->mediation))
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
            ->setEmail(trim($data->email))
            ->setPhone(trim($data->phone))
            ->setPhone2(trim($data->phone2))
            ->setTransport((int) $data->transport)
            ->setImmatriculation(trim($data->immatriculation))
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

        $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname));
        $firstname = ucfirst($this->sanitizeData->sanitizeString($data->firstname));
        $code = mb_strtoupper(substr($lastname, 0, 1) . substr($firstname, 0, 1)) . time();

        $isCoIndivisaire = $this->setToNullInteger($data->isCoIndivisaire);

        if($isCoIndivisaire){
            $obj = ($obj)
                ->setCoLastname(mb_strtoupper($this->sanitizeData->sanitizeString($data->coLastname)))
                ->setCoFirstname(ucfirst($this->sanitizeData->sanitizeString($data->coFirstname)))
                ->setCoEmail(trim($data->coEmail))
                ->setCoPhone(trim($data->coPhone))
                ->setCoAddress(trim($data->coAddress))
                ->setCoZipcode(trim($data->zipcode))
                ->setCoCity(trim($data->city))
            ;
        }

        return ($obj)
            ->setSociety($society)
            ->setCode($code)
            ->setLastname($lastname)
            ->setFirstname($firstname)
            ->setCivility((int) $data->civility)
            ->setEmail(trim($data->email))
            ->setPhone1(trim($data->phone1))
            ->setPhone2(trim($data->phone2))
            ->setPhone3(trim($data->phone3))
            ->setAddress(trim($data->address))
            ->setZipcode(trim($data->zipcode))
            ->setCity(trim($data->city))
            ->setCountry(trim($data->country))
            ->setCategory($this->setToNullInteger($data->category))
            ->setIsCoIndivisaire($isCoIndivisaire)
        ;
    }
}
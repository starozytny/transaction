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
use App\Entity\Immo\ImTenant;
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
        return $value != "" ? (int) $value == 1 : ImBien::ANSWER_UNKNOWN;
    }
    private function setToZeroEmpty($value): ?int
    {
        return $value != "" ? (int) $value : ImBien::BUSY_NONE;
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

        $owner = null;
        if($data->owner){
            $owner = $this->em->getRepository(ImOwner::class)->findOneBy(['id' => $data->owner]);
            if(!$owner){
                return ['message' => 'Un problème est survenue au niveau du propriétaire.'];
            }
        }

        if($data->tenants){
            $idTenants = [];
            foreach($data->tenants as $te){
                $idTenants[] = $te->id;
            }

            $tenants = $this->em->getRepository(ImTenant::class)->findBy(['id' => $idTenants]);
            foreach($tenants as $tenant){
                $obj->addTenant($tenant);
            }
        }

        // Création de l'objet
        return ($obj)
            ->setSlug(null)
            ->setCodeTypeAd((int) $codeTypeAd)
            ->setCodeTypeBien((int) $codeTypeBien)
            ->setLibelle(trim($libelle))
            ->setCodeTypeMandat((int) $codeTypeMandat)
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
            ->setIsMeuble($this->setToUnknownEmpty($data->isMeuble))
            ->setIsNew($this->setToUnknownEmpty($data->isNew))
            ->setDispoAt($this->createDate($data->dispoAt))
            ->setBusy($this->setToZeroEmpty($data->busy))
            ->setBuildAt($this->setToNullInteger($data->buildAt))
            ->setFloor(trim($data->floor))
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
            ->setAddress(trim($data->address))
            ->setZipcode(trim($data->zipcode))
            ->setCity(trim($data->city))
            ->setCountry(trim($data->country))
            ->setDepartement(trim($data->departement))
            ->setQuartier(trim($data->quartier))
            ->setLat((float) $data->lat)
            ->setLon((float) $data->lon)
        ;
    }

    public function setDataFinancial(ImFinancial $obj, $data): ImFinancial
    {
        return ($obj)
            ->setTypeCalcul($data->typeCalcul)
            ->setPrice((float) $data->price)
            ->setProvisionCharges($this->setToNullFloat($data->provisionCharges))
            ->setProvisionOrdures($this->setToNullFloat($data->provisionOrdures))
            ->setTva($this->setToNullFloat($data->tva))
            ->setTotalTerme($this->setToNullFloat($data->totalTerme))
            ->setCaution($this->setToNullFloat($data->caution))
            ->setHonoraireTtc($this->setToNullFloat($data->honoraireTtc))
            ->setHonoraireBail($this->setToNullFloat($data->honoraireBail))
            ->setEdl($this->setToNullFloat($data->edl))
            ->setTypeCharges($this->setToNullInteger($data->typeCalcul))
            ->setTotalGeneral($this->setToNullFloat($data->totalGeneral))
            ->setTypeBail($this->setToNullInteger($data->typeBail))
            ->setDurationBail($this->setToNullFloat($data->durationBail))
            ->setChargesMensuelles($this->setToNullFloat($data->chargesMensuelles))
            ->setNotaire($this->setToNullFloat($data->notaire))
            ->setFoncier($this->setToNullFloat($data->foncier))
            ->setTaxeHabitation($this->setToNullFloat($data->taxeHabitation))
            ->setHonoraireChargeDe($this->setToNullFloat($data->honoraireChargeDe))
            ->setHonorairePourcentage($this->setToNullFloat($data->honorairePourcentage))
            ->setPriceHorsAcquereur($this->setToNullFloat($data->prixHorsAcquereur))
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
        $agency = $this->em->getRepository(ImAgency::class)->find($data->agency);
        if(!$agency){
            throw new Exception("Agence introuvable.");
        }
        $negotiator = $this->em->getRepository(ImNegotiator::class)->find($data->negotiator);

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
            ->setAgency($agency)
            ->setNegotiator($negotiator)
            ->setCode($code)
            ->setLastname($lastname)
            ->setFirstname($firstname)
            ->setCivility((int) $data->civility)
            ->setEmail(trim($data->email))
            ->setPhone1(trim($data->phone1))
            ->setPhone2(trim($data->phone2))
            ->setPhone3(trim($data->phone3))
            ->setAddress(trim($data->address))
            ->setComplement(trim($data->complement))
            ->setZipcode(trim($data->zipcode))
            ->setCity(trim($data->city))
            ->setCountry(trim($data->country))
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

        $lastname = mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname));
        $firstname = ucfirst($this->sanitizeData->sanitizeString($data->firstname));

        return ($obj)
            ->setAgency($agency)
            ->setNegotiator($negotiator)
            ->setLastname($lastname)
            ->setFirstname($firstname)
            ->setCivility((int) $data->civility)
            ->setEmail(trim($data->email))
            ->setPhone1(trim($data->phone1))
            ->setPhone2(trim($data->phone2))
            ->setPhone3(trim($data->phone3))
            ->setAddress(trim($data->address))
            ->setComplement(trim($data->complement))
            ->setZipcode(trim($data->zipcode))
            ->setCity(trim($data->city))
            ->setCountry(trim($data->country))
            ->setBirthday($this->createDate($data->birthday))
        ;
    }
}
<?php

namespace App\Service\Data;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Society;
use Exception;

class DataImmo extends DataConstructor
{
    /**
     * @throws Exception
     */
    public function setDataBien(ImBien $obj, $data, ImArea $area)
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
        if ($noErrors != true) {
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
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataArea(ImArea $obj, $data)
    {
        $areaTotal      = $data->areaTotal;
        $areaHabitable  = $data->areaHabitable != "" ?: null;
        $areaLand       = $data->areaLand != "" ?: null;
        $areaGarden     = $data->areaGarden != "" ?: null;
        $areaTerrace    = $data->areaTerrace != "" ?: null;
        $areaCave       = $data->areaCave != "" ?: null;
        $areaBathroom   = $data->areaBathroom != "" ?: null;
        $areaLiving     = $data->areaLiving != "" ?: null;
        $areaDining     = $data->areaDining != "" ?: null;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',   'name' => 'areaTotal',       'value' => $areaTotal],
        ];
        $noErrors = $this->validator->validateCustom($paramsToValidate);
        if ($noErrors != true) {
            return $noErrors;
        }

        // Création de l'objet
        return ($obj)
            ->setTotal((float) $areaTotal)
            ->setHabitable((float) $areaHabitable)
            ->setLand((float) $areaLand)
            ->setGarden((float) $areaGarden)
            ->setTerrace((float) $areaTerrace)
            ->setCave((float) $areaCave)
            ->setBathroom((float) $areaBathroom)
            ->setLiving((float) $areaLiving)
            ->setDining((float) $areaDining)
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
}
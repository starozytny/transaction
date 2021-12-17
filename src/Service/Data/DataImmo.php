<?php

namespace App\Service\Data;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
use App\Entity\Society;
use Doctrine\ORM\EntityManagerInterface;
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

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',   'name' => 'codeTypeAd',      'value' => $codeTypeAd],
            ['type' => 'text',   'name' => 'codeTypeBien',    'value' => $codeTypeBien],
            ['type' => 'text',   'name' => 'libelle',         'value' => $libelle],
            ['type' => 'text',   'name' => 'codeTypeMandat',  'value' => $codeTypeMandat],
            ['type' => 'length', 'name' => 'libelle',         'value' => $libelle, 'min' => 0, 'max' => 64]
        ];
        $noErrors = $this->validator->validateCustom($paramsToValidate);
        if ($noErrors != true) {
            return $noErrors;
        }

        // Création de l'objet
        return ($obj)
            ->setSlug(null)
            ->setCodeTypeAd((int) $codeTypeAd)
            ->setCodeTypeBien((int) $codeTypeBien)
            ->setLibelle(trim($libelle))
            ->setCodeTypeMandat((int) $codeTypeMandat)
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
            ->setTotal($areaTotal)
            ->setHabitable($areaHabitable)
            ->setLand($areaLand)
            ->setGarden($areaGarden)
            ->setTerrace($areaTerrace)
            ->setCave($areaCave)
            ->setBathroom($areaBathroom)
            ->setLiving($areaLiving)
            ->setDining($areaDining)
        ;
    }

    public function setDataAgency(ImAgency $agency, $data): ImAgency
    {
        $society = $this->em->getRepository(Society::class)->find($data->society);

        return ($agency)
            ->setSociety($society)
            ->setName($data->name)
            ->setDirname($data->dirname)
            ->setWebsite($data->website)
            ->setEmail($data->email)
            ->setEmailLocation($data->emailLocation)
            ->setEmailVente($data->emailVente)
            ->setPhone($data->phone)
            ->setPhoneLocation($data->phoneLocation)
            ->setPhoneVente($data->phoneVente)
            ->setAddress($data->address)
            ->setZipcode($data->zipcode)
            ->setCity($data->city)
            ->setLat($data->lat)
            ->setLon($data->lon)
            ->setIdentifiant($data->dirname)
            ->setDescription($data->description->html)
            ->setType($data->type)
            ->setSiret($data->siret)
            ->setRcs($data->rcs)
            ->setCartePro($data->cartePro)
            ->setGarantie($data->garantie)
            ->setAffiliation($data->affiliation)
            ->setMediation($data->mediation)
        ;
    }
}
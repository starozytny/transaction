<?php

namespace App\Entity;

use Carbon\Carbon;
use Carbon\Factory;
use Exception;

class DataEntity
{
    public function initNewDate(): \DateTime
    {
        $createdAt = new \DateTime();
        $createdAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        return $createdAt;
    }

    /**
     * @throws Exception
     */
    public function initToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    /**
     * How long ago
     *
     * @param $date
     * @return string|null
     */
    public function getHowLongAgo($date): ?string
    {
        if($date){
            $frenchFactory = new Factory([
                'locale' => 'fr_FR',
                'timezone' => 'Europe/Paris'
            ]);
            $time = Carbon::instance($date);
            $time->subHours(1);

            return str_replace("dans", "il y a", $frenchFactory->make($time)->diffForHumans());
        }

        return null;
    }

    /**
     * return ll -> 5 janv. 2017
     * return LL -> 5 janvier 2017
     * return llll -> 5 janv. 2017 00:00
     * return LLLL -> 5 janvier 2017 00:00
     *
     * @param $date
     * @param string $format
     * @param bool $isAgenda
     * @return string|null
     */
    public function getFullDateString($date, string $format = "ll", bool $isAgenda = false): ?string
    {
        if($date){
            $frenchFactory = new Factory([
                'locale' => 'fr_FR',
                'timezone' => 'Europe/Paris'
            ]);
            $time = Carbon::instance($date);
            if(!$isAgenda){
                $time->subHours(1);
            }

            return ucfirst($frenchFactory->make($time)->isoFormat($format));
        }

        return null;
    }

    /**
     * return human date hours
     *
     * @param $date
     * @return string|null
     */
    public function setDateHumanHours($date): ?string
    {
        date_default_timezone_set('Europe/Paris');
        return $date ? str_replace(":", "h", date_format($date, "D\\.d M Y \\à H\\hi")) : null;
    }

    /**
     * return format for new Date JS
     *
     * @param $date
     * @return string|null
     */
    public function setDateAgenda($date): ?string
    {
        date_default_timezone_set('Europe/Paris');
        return $date != null ? date_format($date, 'Y-m-d H:i:s') : null;
    }

    /**
     * return format for new Date JS
     *
     * @param $date
     * @return string|null
     */
    public function setDateJavascript($date): ?string
    {
        date_default_timezone_set('Europe/Paris');
        return $date != null ? date_format($date, 'F d, Y H:i:s') : null;
    }

    public function getFullAddressString($address, $zipcode, $city, $complement="", $country = ""): string
    {
        $complement = $complement != null && $complement != "" ? ", " . $complement : "";
        $zipcode = $zipcode != null && $zipcode != "" ? ", " . $zipcode : "";
        $city = $city != null && $city != "" ? " " . $city : "";
        $country = $country != null && $country != "" ? " - " . $country : "";

        return $address . $complement .  $zipcode . $city . $country;
    }

    public function getFullNameString($lastname, $firstname, $civility = ""): string
    {
        $civility = $civility != null && $civility != "" ? $civility . " " : "";
        return $civility . $lastname . " " . $firstname;
    }

    public function setCivilityString($civility): string
    {
        $civilities = ["Mr", "Mme", "Société", "Mr ou Mme", "Mr et Mme"];

        return $civilities[$civility];
    }

    public function getFileOrDefault($file, $folder, $default = "/placeholders/placeholder.jpg")
    {
        return $file ? "/" . $folder . "/" . $file : $default;
    }

    public function getCodeTypeAdString($value): string
    {
        $data = ["Vente", "Location", "Viager", "Produit d'investissement", "Cession bail", "Location vacances", "Vente prestige", "Fond de commerce"];

        return $data[$value];
    }

    public function getCodeTypeBienString($value): string
    {
        $data = ["Appartement", "Maison", "Parking/Box", "Terrain", "Boutique", "Bureau", "Château", "Immeuble", "Terrain + Maison", "Inconnu"];

        return $data[$value];
    }

    public function getStatusStringEvent($value): string
    {
        $data = ["Inactif", "Actif", "Annulé", "Fini", "Supprimé"];

        return $data[$value];
    }
}

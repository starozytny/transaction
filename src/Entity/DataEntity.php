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
     * @param int $subHours
     * @return string|null
     */
    public function getHowLongAgo($date, $subHours = 1): ?string
    {
        if($date){
            $frenchFactory = new Factory([
                'locale' => 'fr_FR',
                'timezone' => 'Europe/Paris'
            ]);
            $time = Carbon::instance($date);
            $time->subHours($subHours);

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

    /**
     * encrypt or decrypt iban or bic
     *
     * @param $action
     * @param $data
     * @return false|string|void
     */
    public function cryptBank($action, $data)
    {
        $data = trim($data);
        $data = preg_replace('/\s+/', '', $data);

        $method = 'aes-256-cbc';
        $passBank = "shanboBrume89*ù^@rt.569!4*+(=)";
        $passBank = substr(hash('sha256', $passBank, true), 0, 32);
        $iv = chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0);

        if ($action == 'encrypt') {
            return base64_encode(openssl_encrypt($data, $method, $passBank, OPENSSL_RAW_DATA, $iv));
        } elseif ($action == 'decrypt') {
            return openssl_decrypt(base64_decode($data), $method, $passBank, OPENSSL_RAW_DATA, $iv);
        }
    }

    public function toFormatIbanHidden($value): ?string
    {
        if($value != "" && $value != null){
            $value = trim($value);
            $value = str_replace(" ", "", $value);

            $a = substr($value,0,4);
            $b = substr($value,4,4);
            $c = substr($value,8,4);
            $d = substr($value,12,4);
            $g = substr($value,24,3);

            return $a . ' ' . $b . ' ' . $c . ' ' . $d . ' XXXX XXXX ' . $g;
        }

        return null;
    }

    public function setDateTimeZone($value, $timeZone = "Europe/Paris")
    {
        $value->setTimezone(new \DateTimeZone($timeZone));

        return $value;
    }

    public function getCodeTypeAdString($value): string
    {
        $data = ["Vente", "Location", "Viager", "Produit d'investissement", "Cession bail", "Location vacances", "Vente prestige", "Fond de commerce"];

        return $data[$value];
    }

    public function getCodeTypeBienString($value): string
    {
        $data = ["Appartement", "Maison", "Parking/Box", "Terrain", "Boutique", "Bureau", "Château", "Immeuble", "Terrain + Maison",
            "Bâtiment", "Local", "Loft/Atelier/Surface", "Hôtel particulier", "Autres"];

        return $data[$value];
    }

    public function getCodeTypeBienSeLoger($value): string
    {
        $data = ["Appartement", "maison", "parking/Box", "terrain", "boutique", "bureaux", "château", "immeuble", "maison avec terrain",
            "bâtiment", "local", "loft/atelier/surface", "hôtel particulier", "inconnu"];

        return $data[$value];
    }

    public function getStatusStringEvent($value): string
    {
        $data = ["Inactif", "Actif", "Annulé", "Fini", "Supprimé"];

        return $data[$value];
    }
}

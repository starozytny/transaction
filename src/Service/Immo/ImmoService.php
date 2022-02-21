<?php


namespace App\Service\Immo;


use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImSupport;
use App\Service\Data\DataImmo;
use Doctrine\ORM\EntityManagerInterface;

class ImmoService
{
    private $em;
    private $imagesDirectory;
    private $thumbsDirectory;
    private $dataImmo;

    public function __construct($imagesDirectory, $thumbsDirectory, EntityManagerInterface $entityManager, DataImmo $dataImmo)
    {

        $this->em = $entityManager;
        $this->imagesDirectory = $imagesDirectory;
        $this->thumbsDirectory = $thumbsDirectory;
        $this->dataImmo = $dataImmo;
    }

    public function getImagesDirectory()
    {
        return $this->imagesDirectory;
    }

    public function getThumbsDirectory()
    {
        return $this->thumbsDirectory;
    }

    /**
     * @param ImAgency $agency
     */
    public function deleteAgency(ImAgency $agency)
    {
        // remove bien of demandes
        if(count($agency->getBiens()) !== 0){
            foreach($agency->getBiens() as $bien){
                foreach($bien->getDemandes() as $demande){
                    $demande->setBien(null);
                }

                // remove pictures
                foreach($bien->getImages() as $image){
                    $img = $this->getImagesDirectory() . $agency->getDirname() . '/' . $image->getFile();
                    $thumb = $this->getThumbsDirectory() . $agency->getDirname() . '/' . $image->getThumb();
                    if(file_exists($img)){
                        unlink($img);
                    }
                    if(file_exists($thumb)){
                        unlink($thumb);
                    }
                }

                //remove bien
                $this->em->remove($bien);
            }
        }

        //remove agency
        $this->em->remove($agency);
    }

    public function initiateSupport(ImAgency $agency): bool
    {
        $supports = $this->em->getRepository(ImSupport::class)->findBy(['agency' => $agency]);
        if(count($supports) > 0){
            return false;
        }

        $data = [
            [
                "code" => ImSupport::CODE_SELOGER,
                "name" => "SeLoger",
                "filename" => "annonces",
                "ftpServer" => "transferts.seloger.com", "ftpPort" => 21, "maxPhotos" => 9
            ],
            [
                "code" => ImSupport::CODE_LOGICIMMO,
                "name" => "Logic Immo",
                "filename" => null,
                "ftpServer" => "Zimport.logic-immo.com", "ftpPort" => 21, "maxPhotos" => 5
            ],
            [
                "code" => ImSupport::CODE_LEBONCOIN,
                "name" => "Leboncoin",
                "filename" => null,
                "ftpServer" => null, "ftpPort" => 21, "maxPhotos" => 9
            ],
            [
                "code" => ImSupport::CODE_PARUVENDU,
                "name" => "ParuVendu",
                "filename" => "Annonces",
                "ftpServer" => "Z212.95.67.167", "ftpPort" => 21, "maxPhotos" => 9
            ],
            [
                "code" => ImSupport::CODE_ANNONCESJAUNES,
                "name" => "Annonces Jaunes",
                "filename" => null,
                "ftpServer" => "Zfluxftp.annoncesjaunes.fr", "ftpPort" => 21, "maxPhotos" => 6
            ],
            [
                "code" => ImSupport::CODE_TOPANNONCES,
                "name" => "Topannonces",
                "filename" => null,
                "ftpServer" => "Zpasserelles-ftp-topannonces.hopps-group.com", "ftpPort" => 21, "maxPhotos" => 5
            ],
            [
                "code" => ImSupport::CODE_SITIMMO,
                "name" => "Sitimmo",
                "filename" => "Annonces",
                "ftpServer" => "Zftp.sitimmo.com", "ftpPort" => 21, "maxPhotos" => 6
            ],
        ];

        foreach ($data as $item) {
            $item = json_decode(json_encode($item));

            $obj = $this->dataImmo->setDataSupport(new ImSupport(), $item);

            $obj->setAgency($agency);

            $this->em->persist($obj);
        }

        return true;
    }
}
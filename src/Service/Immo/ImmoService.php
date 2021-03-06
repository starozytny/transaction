<?php


namespace App\Service\Immo;


use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Transaction\Entity\Immo\ImSupport;
use App\Entity\User;
use App\Service\Data\DataImmo;
use App\Service\Export;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Http\Discovery\Exception\NotFoundException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\Serializer\SerializerInterface;

class ImmoService
{
    private $imagesDirectory;
    private $thumbsDirectory;
    private $privateDirectory;
    private $dataImmo;
    private $export;
    private $registry;

    public function __construct($imagesDirectory, $thumbsDirectory, $privateDirectory, ManagerRegistry $registry,
                                DataImmo $dataImmo, Export $export)
    {

        $this->imagesDirectory = $imagesDirectory;
        $this->thumbsDirectory = $thumbsDirectory;
        $this->privateDirectory = $privateDirectory;
        $this->dataImmo = $dataImmo;
        $this->export = $export;
        $this->registry = $registry;
    }

    public function getEntityNameManager($nameManager = "default"): ObjectManager
    {
        return $this->registry->getManager($nameManager);
    }

    public function getEntityUserManager($user): ObjectManager
    {
        /** @var User $user */
        return $this->registry->getManager($user->getManager());
    }

    public function getUserAgency($user)
    {
        /** @var User $user */
        $agency = $this->getEntityUserManager($user)->getRepository(ImAgency::class)->find($user->getAgencyId());
        if(!$agency){
            throw new NotFoundException("Agence introuvable : " . $user->getId());
        }

        return $agency;
    }

    public function getImagesDirectory()
    {
        return $this->imagesDirectory;
    }

    public function getThumbsDirectory()
    {
        return $this->thumbsDirectory;
    }

    public function getPrivateDirectory()
    {
        return $this->privateDirectory;
    }

    public function getDonneeData($em, $class, User $user, ?SerializerInterface $serializer, $group = User::DONNEE_READ)
    {
        $natives = $em->getRepository($class)->findBy(['isNative' => true]);
        $customs = $em->getRepository($class)->findBy(['agency' => $user->getAgencyId()]);
        $data = array_merge($natives, $customs);

        if($serializer){
            $data = $serializer->serialize($data, 'json', ['groups' => $group]);
        }

        return $data;
    }

    public function getNumeroMandat(ImAgency $agency): string
    {
        $tab = array_map('intval', str_split($agency->getCounterMandat()));

        $year = (new \DateTime())->format('y');

        $nbZero = 6 - count($tab);

        $counter = $year . str_repeat("0", $nbZero);
        $counter .= $agency->getCounter();

        return $counter;
    }

    public function getReference(ImAgency $agency, $codeTypeAd): string
    {
        $data = ["VE", "LO", "VI", "PI", "CB", "LV", "VP", "FC"];

        $tab = array_map('intval', str_split($agency->getCounter()));

        $year = (new \DateTime())->format('y');

        $nbZero = 6 - count($tab);

        $counter = $year . str_repeat("0", $nbZero);
        $counter .= $agency->getCounter();

        return $counter . $agency->getCode() . $data[$codeTypeAd];
    }

    /**
     * @param ImAgency $agency
     */
    public function deleteAgency(ImAgency $agency)
    {
        $em = $this->getEntityNameManager($agency->getManager());

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
                $em->remove($bien);
            }
        }

        //remove agency
        $em->remove($agency);
    }

    public function exportData($format, User $user, $class, $nameFile): BinaryFileResponse
    {
        $em = $this->getEntityUserManager($user);

        $objs = $em->getRepository($class)->findBy(["agency" => $user->getAgencyId()], ['lastname' => 'ASC']);
        $data = [];

        $nameFolder = 'export/';

        foreach ($objs as $obj) {
            $tmp = [
                $obj->getId(),
                $obj->getLastname(),
                $obj->getFirstname(),
                $obj->getEmail(),
                $obj->getPhone1(),
                $obj->getPhone2(),
                $obj->getPhone3(),
            ];
            if(!in_array($tmp, $data)){
                $data[] = $tmp;
            }
        }

        $fileName = $nameFile . '.xlsx';
        $header = array(array('Code', 'Nom', 'Pr??nom', 'Email', 'T??l??phone 1', 'T??l??phone 2', 'T??l??phone 3'));

        $this->export->createFile($format, 'Liste des ' . $nameFile, $fileName , $header, $data, 7, $nameFolder);
        return new BinaryFileResponse($this->getPrivateDirectory(). $nameFolder . $fileName);
    }

    public function initiateSupport(ImAgency $agency): bool
    {
        $em = $this->getEntityNameManager($agency->getManager());

        $supports = $em->getRepository(ImSupport::class)->findBy(['agency' => $agency]);
        if(count($supports) > 0){
            return false;
        }

        $data = [
            [
                "code" => ImSupport::CODE_SELOGER,
                "name" => "SeLoger",
                "filename" => "annonces",
                "ftpUser" => "", "ftpPassword" => "",
                "ftpServer" => "transferts.seloger.com", "ftpPort" => 21, "maxPhotos" => 9
            ],
            [
                "code" => ImSupport::CODE_LOGICIMMO,
                "name" => "Logic Immo",
                "filename" => null,
                "ftpUser" => "", "ftpPassword" => "",
                "ftpServer" => "Zimport.logic-immo.com", "ftpPort" => 21, "maxPhotos" => 5
            ],
            [
                "code" => ImSupport::CODE_LEBONCOIN,
                "name" => "Leboncoin",
                "filename" => null,
                "ftpUser" => "", "ftpPassword" => "",
                "ftpServer" => null, "ftpPort" => 21, "maxPhotos" => 9
            ],
            [
                "code" => ImSupport::CODE_PARUVENDU,
                "name" => "ParuVendu",
                "filename" => "Annonces",
                "ftpUser" => "", "ftpPassword" => "",
                "ftpServer" => "Z212.95.67.167", "ftpPort" => 21, "maxPhotos" => 9
            ],
            [
                "code" => ImSupport::CODE_ANNONCESJAUNES,
                "name" => "Annonces Jaunes",
                "filename" => null,
                "ftpUser" => "", "ftpPassword" => "",
                "ftpServer" => "Zfluxftp.annoncesjaunes.fr", "ftpPort" => 21, "maxPhotos" => 6
            ],
            [
                "code" => ImSupport::CODE_TOPANNONCES,
                "name" => "Topannonces",
                "filename" => null,
                "ftpUser" => "", "ftpPassword" => "",
                "ftpServer" => "Zpasserelles-ftp-topannonces.hopps-group.com", "ftpPort" => 21, "maxPhotos" => 5
            ],
            [
                "code" => ImSupport::CODE_SITIMMO,
                "name" => "Sitimmo",
                "filename" => "Annonces",
                "ftpUser" => "", "ftpPassword" => "",
                "ftpServer" => "Zftp.sitimmo.com", "ftpPort" => 21, "maxPhotos" => 6
            ],
        ];

        foreach ($data as $item) {
            $item = json_decode(json_encode($item));

            $obj = $this->dataImmo->setDataSupport(new ImSupport(), $item);

            $obj->setAgency($agency);

            $em->persist($obj);
        }

        return true;
    }

    public function getSuivi($user, $bien, $prospect)
    {
        $em = $this->getEntityUserManager($user);

        return  $em->getRepository(ImSuivi::class)->findOneBy([
            'bien' => $bien,
            'prospect' => $prospect
        ]);
    }
}

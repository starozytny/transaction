<?php

namespace App\Command\Fake;

use App\Entity\Immo\ImAdvantage;
use App\Entity\Immo\ImAdvert;
use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
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
use App\Entity\Immo\ImPublish;
use App\Entity\Immo\ImRoom;
use App\Entity\Immo\ImSuivi;
use App\Entity\Immo\ImTenant;
use App\Entity\Immo\ImVisit;
use App\Entity\Society;
use App\Entity\User;
use App\Service\Data\DataImmo;
use App\Service\DatabaseService;
use App\Service\Immo\ImmoService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeBiensCreate extends Command
{
    protected static $defaultName = 'fake:biens:create';
    protected $em;
    private $databaseService;
    private $dataImmo;
    private $immoService;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService, DataImmo $dataImmo, ImmoService $immoService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataImmo = $dataImmo;
        $this->immoService = $immoService;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create fake biens.')
        ;
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $society = $this->em->getRepository(Society::class)->findOneBy(['name' => "Logilink"]);
        $agencies = $this->em->getRepository(ImAgency::class)->findBy(['society' => $society]);
        $nbAgencies = count($agencies);
        $negotiators = $this->em->getRepository(ImNegotiator::class)->findBy(['agency' => $agencies]);
        $nbNegotiators = count($negotiators);
        $users = $this->em->getRepository(User::class)->findBy(['society' => $society]);
        $nbUsers = count($users);
        $owners = $this->em->getRepository(ImOwner::class)->findBy(['society' => $society]);
        $tenants = $this->em->getRepository(ImTenant::class)->findBy(['agency' => $agencies]);

        foreach($tenants as $tenant){
            $tenant->setBien(null);
        }

        $this->em->flush();

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [
            ImPublish::class,
            ImOffer::class,
            ImSuivi::class,
            ImVisit::class,
            ImPhoto::class,
            ImRoom::class,
            ImBien::class,
            ImAdvantage::class,
            ImArea::class,
            ImDiag::class,
            ImFeature::class,
            ImFinancial::class,
            ImLocalisation::class,
            ImNumber::class,
            ImConfidential::class,
            ImMandat::class,
        ]);

        if($nbAgencies == 0 || $nbNegotiators == 0 || $nbUsers == 0){
            $io->text("Veuillez créer un ou des agences/négociateurs/utilisateurs avant de lancer cette commande : " .
                " Agences : " . $nbAgencies . " Negos : " . $nbNegotiators . " Users : " . $nbUsers);
            return Command::FAILURE;
        }

        $answers = [0,1,99];

        $io->title('Création de 1000 biens fake');
        $fake = Factory::create();
        for($i=0; $i<1000 ; $i++) {
            $negotiator = $negotiators[$fake->numberBetween(0,$nbNegotiators - 1)];
            $user = $users[$fake->numberBetween(0,$nbUsers - 1)];

            $isDraft = $fake->numberBetween(0, 1);
            $isArchived = $fake->numberBetween(0, 1);

            $data = [
                "codeTypeAd" => (string) $fake->numberBetween(0, 7),
                "codeTypeBien" => (string) $fake->numberBetween(0, 8),
                "libelle" => $fake->name,
                "negotiator" => $negotiator->getId(),
                "areaTotal" => (string) $fake->randomFloat(2),
                "areaHabitable" => (string) $fake->randomFloat(2),
                "areaLand" => (string) $fake->randomFloat(2),
                "areaGarden" => (string) $fake->randomFloat(2),
                "areaTerrace" => (string) $fake->randomFloat(2),
                "areaCave" => (string) $fake->randomFloat(2),
                "areaBathroom" => (string) $fake->randomFloat(2),
                "areaLiving" => (string) $fake->randomFloat(2),
                "areaDining" => (string) $fake->randomFloat(2),
                "piece" => (string) $fake->randomDigit(),
                "room" => (string) $fake->randomDigit(),
                "bathroom" => (string) $fake->randomDigit(),
                "wc" => (string) $fake->randomDigit(),
                "balcony" => (string) $fake->randomDigit(),
                "parking" => (string) $fake->randomDigit(),
                "box" => (string) $fake->randomDigit(),
                "dispoAt" => $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
                "buildAt" => $fake->numberBetween(1600, 2021),
                "busy" => $fake->numberBetween(0, 2),
                "isMeuble" => $answers[$fake->numberBetween(0,2)],
                "isNew" => $answers[$fake->numberBetween(0,2)],
                "floor" => (string) $fake->randomDigit(),
                "nbFloor" => (string) $fake->randomDigit(),
                "codeHeater0" => $fake->numberBetween(0, 1),
                "codeHeater" => $fake->numberBetween(0, 15),
                "codeKitchen" => $fake->numberBetween(0, 8),
                "isWcSeparate" => $answers[$fake->numberBetween(0,2)],
                "codeWater" =>  $fake->numberBetween(0, 1),
                "exposition" => (string) $fake->numberBetween(0, 5),
                "hasGarden" => $answers[$fake->numberBetween(0,2)],
                "hasTerrace" => $answers[$fake->numberBetween(0,2)],
                "hasPool" => $answers[$fake->numberBetween(0,2)],
                "hasCave" => $answers[$fake->numberBetween(0,2)],
                "hasDigicode" => $answers[$fake->numberBetween(0,2)],
                "hasInterphone" => $answers[$fake->numberBetween(0,2)],
                "hasGuardian" => $answers[$fake->numberBetween(0,2)],
                "hasAlarme" => $answers[$fake->numberBetween(0,2)],
                "hasLift" => $answers[$fake->numberBetween(0,2)],
                "hasClim" => $answers[$fake->numberBetween(0,2)],
                "hasCalme" => $answers[$fake->numberBetween(0,2)],
                "hasInternet" => $answers[$fake->numberBetween(0,2)],
                "hasHandi" => $answers[$fake->numberBetween(0,2)],
                "hasFibre" => $answers[$fake->numberBetween(0,2)],
                "situation" => $fake->name,
                "sousType" => $fake->numberBetween(0, 10),
                "sol" => $fake->numberBetween(0, 4),
                "beforeJuly" => 1,
                "isVirgin" => 0,
                "isSend" => 0,
                "createdAtDpe" => $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
                "referenceDpe" => $fake->numberBetween(1600, 2021),
                "dpeLetter" => (string) $fake->numberBetween(0, 6),
                "gesLetter" => (string) $fake->numberBetween(0, 6),
                "dpeValue" => (string) $fake->numberBetween(0, 350),
                "gesValue" => (string) $fake->numberBetween(0, 350),
                "minAnnual" => (string) $fake->numberBetween(0, 10000),
                "maxAnnual" => (string) $fake->numberBetween(0, 10000),
                "address" => $fake->streetName,
                "hideAddress" => $fake->numberBetween(0, 1),
                "zipcode" => $fake->postcode,
                "city" => $fake->city,
                "country" => $fake->country,
                "departement" => $fake->citySuffix,
                "quartier" => $fake->streetName,
                "lat" => (string) $fake->latitude,
                "lon" => (string) $fake->longitude,
                "hideMap" => $fake->numberBetween(0, 1),
                "typeCalcul" => $fake->numberBetween(0, 2),
                "price" => (string) $fake->randomFloat(2),
                "provisionCharges" => (string) $fake->randomFloat(2),
                "provisionOrdures" => (string) $fake->randomFloat(2),
                "tva" => (string) $fake->randomFloat(2),
                "totalTerme" => (string) $fake->randomFloat(2),
                "caution" => (string) $fake->randomFloat(2),
                "honoraireTtc" => (string) $fake->randomFloat(2),
                "honoraireBail" => (string) $fake->randomFloat(2),
                "edl" => (string) $fake->randomFloat(2),
                "typeCharges" => $fake->numberBetween(0, 2),
                "totalGeneral" => (string) $fake->randomFloat(2),
                "typeBail" => $fake->numberBetween(0, 3),
                "durationBail" => (string) $fake->numberBetween(0,5),
                "chargesMensuelles" => (string) $fake->randomFloat(2),
                "notaire" => (string) $fake->randomFloat(2),
                "foncier" => (string) $fake->randomFloat(2),
                "taxeHabitation" => (string) $fake->randomFloat(2),
                "honoraireChargeDe" => $fake->numberBetween(0,2),
                "honorairePourcentage" => (string) $fake->randomFloat(2),
                "priceHorsAcquereur" => (string) $fake->randomFloat(2),
                "isCopro" => $fake->numberBetween(0,1),
                "nbLot" => $fake->numberBetween(0, 500),
                "chargesLot" => (string) $fake->randomFloat(2),
                "isSyndicProcedure" => $fake->numberBetween(0,1),
                "detailsProcedure" => $fake->sentence,
                "inform" => $fake->numberBetween(0, 3),
                "lastname" => $fake->lastName,
                "phone1" => $fake->e164PhoneNumber,
                "email" => $fake->email,
                "visiteAt" => $fake->numberBetween(0,1) == 1 ? $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z") : null,
                "keysNumber" => $fake->randomNumber(1),
                "keysWhere" => $fake->streetName,
                "typeAdvert" => $fake->numberBetween(0, 2),
                "contentSimple" => $fake->text,
                "contentFull" => $fake->sentence(255),
                "isDraft" => $isArchived ? false : $isDraft,
                "codeTypeMandat" => (string) $fake->numberBetween(0, 3),
                "startAt" => $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
                "endAt" => $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
                "priceEstimate" => "",
                "fee" => "",
            ];

            $data = json_decode(json_encode($data));

            $advert         = $this->dataImmo->setDataAdvert(new ImAdvert(), $data);
            $confidential   = $this->dataImmo->setDataConfidential(new ImConfidential(), $data);
            $financial      = $this->dataImmo->setDataFinancial(new ImFinancial(), $data);
            $localisation   = $this->dataImmo->setDataLocalisation(new ImLocalisation(), $data);
            $diag           = $this->dataImmo->setDataDiag(new ImDiag(), $data);
            $advantage      = $this->dataImmo->setDataAdvantage(new ImAdvantage(), $data);
            $feature        = $this->dataImmo->setDataFeature(new ImFeature(), $data);
            $number         = $this->dataImmo->setDataNumber(new ImNumber(), $data);
            $area           = $this->dataImmo->setDataArea(new ImArea(), $data);
            $mandat         = $this->dataImmo->setDataMandat(new ImMandat(), $data);

            $obj = $this->dataImmo->setDataBien($this->immoService, $user->getAgency(), new ImBien(), $data, $area, $number, $feature, $advantage, $diag,
                $localisation, $financial, $confidential, $advert, $mandat, []);

            $choicesOwners = [];
            foreach($owners as $ow){
                if($ow->getNegotiator() && $ow->getNegotiator()->getAgency()->getId() == $user->getAgency()->getId()){
                    $choicesOwners[] = $ow;
                }
            }
            $owner = null;
            if(count($choicesOwners) > 0){
                $owner = $choicesOwners[$fake->numberBetween(0,count($choicesOwners) - 1)];
            }

            $choicesTenants = [];
            foreach($tenants as $te){
                if($te->getAgency()->getId() == $user->getAgency()->getId()){
                    $choicesTenants[] = $te;
                }
            }

            if($fake->numberBetween(0,1) == 1 && count($choicesTenants) > 0){
                shuffle($choicesTenants);

                $limit = $fake->numberBetween(0, count($choicesTenants) - 1);

                $finalTenants = [];
                if($limit > 0){
                    for($j = 0 ; $j < $limit ; $j++){
                        $finalTenants[] = $choicesTenants[$j];
                    }
                }

                foreach ($finalTenants as $te){
                    $obj->addTenant($te);
                }
            }

            $obj = ($obj)
                ->setUser($user)
                ->setCreatedBy($user->getShortFullName())
                ->setIdentifiant(uniqid().bin2hex(random_bytes(8)) . random_int(100,999))
                ->setAgency($user->getAgency())
                ->setOwner($owner)
            ;

            if($isArchived == 0){
                $status = $fake->numberBetween(0, 1);
                $obj = ($obj)
                    ->setIsPublished(!$status == 0)
                    ->setStatus($status)
                ;

                if($isDraft == 1){
                    $obj = ($obj)
                        ->setIsPublished(false)
                        ->setStatus(ImBien::STATUS_DRAFT)
                        ->setIsDraft($isDraft)
                    ;
                }
            }else{
                $obj = ($obj)
                    ->setIsPublished(false)
                    ->setStatus(ImBien::STATUS_ARCHIVE)
                    ->setIsArchived($isArchived)
                ;
            }

            $this->em->persist($obj);
        }
        $io->text('BIENS : Biens fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

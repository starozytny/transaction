<?php

namespace App\Command\Fake;

use App\Transaction\Entity\Immo\ImAdvantage;
use App\Transaction\Entity\Immo\ImAdvert;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImArea;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImConfidential;
use App\Transaction\Entity\Immo\ImContract;
use App\Transaction\Entity\Immo\ImContractant;
use App\Transaction\Entity\Immo\ImDiag;
use App\Transaction\Entity\Immo\ImFeature;
use App\Transaction\Entity\Immo\ImFinancial;
use App\Transaction\Entity\Immo\ImLocalisation;
use App\Transaction\Entity\Immo\ImMandat;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImNumber;
use App\Transaction\Entity\Immo\ImOffer;
use App\Transaction\Entity\Immo\ImOwner;
use App\Transaction\Entity\Immo\ImPhoto;
use App\Transaction\Entity\Immo\ImPublish;
use App\Transaction\Entity\Immo\ImRoom;
use App\Transaction\Entity\Immo\ImSeller;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Transaction\Entity\Immo\ImVisit;
use App\Entity\Society;
use App\Entity\User;
use App\Service\Data\DataImmo;
use App\Service\DatabaseService;
use App\Service\Immo\ImmoService;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeBiensCreate extends Command
{
    protected static $defaultName = 'fake:biens:create';
    private $em;
    private $registry;
    private $databaseService;
    private $dataImmo;
    private $immoService;

    public function __construct(ManagerRegistry $registry, DatabaseService $databaseService,
                                DataImmo $dataImmo, ImmoService $immoService)
    {
        parent::__construct();

        $this->em = $registry->getManager();
        $this->registry = $registry;
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

        $emT = $this->registry->getManager($society->getManager());

        $users          = $this->em->getRepository(User::class)->findBy(['society' => $society]);
        $agencies       = $emT->getRepository(ImAgency::class)->findBy(['societyId' => $society->getId()]);
        $negotiators    = $emT->getRepository(ImNegotiator::class)->findBy(['agency' => $agencies]);
        $owners         = $emT->getRepository(ImOwner::class)->findBy(['agency' => $agencies]);

        $nbAgencies = count($agencies);
        $nbNegotiators = count($negotiators);
        $nbUsers = count($users);

        if($nbAgencies == 0 || $nbNegotiators == 0 || $nbUsers == 0){
            $io->text("Veuillez cr??er un ou des agences/n??gociateurs/utilisateurs avant de lancer cette commande : " .
                " Agences : " . $nbAgencies . " Negos : " . $nbNegotiators . " Users : " . $nbUsers);
            return Command::FAILURE;
        }

        $io->title('Reset des tables');
        $societies = $this->em->getRepository(Society::class)->findAll();
        foreach($societies as $society){
            $this->databaseService->resetTable($io, $society->getManager(), [
                ImSeller::class,
                ImContractant::class,
                ImContract::class,
                ImPhoto::class,
                ImPublish::class,
                ImOffer::class,
                ImSuivi::class,
                ImVisit::class,
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
        }

        $answers = [0,1,99];

        $io->title('Cr??ation de 200 biens fake');
        $fake = Factory::create();
        for($i=0; $i<200 ; $i++) {
            $negotiator = $negotiators[$fake->numberBetween(0,$nbNegotiators - 1)];
            $user = $users[$fake->numberBetween(0,$nbUsers - 1)];

            $isDraft = $fake->numberBetween(0, 1);
            $isArchived = $fake->numberBetween(0, 1);

            $codeTypeBien = $fake->numberBetween(0, 13);

            $data = [
                "caseTypeBien" => $codeTypeBien == ImBien::BIEN_PARKING_BOX || $codeTypeBien == ImBien::BIEN_TERRAIN ? 2 : 1,
                "codeTypeAd" => (string) $fake->numberBetween(0, 7),
                "codeTypeBien" => (string) $codeTypeBien,
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
                "nbVehicles" => (string) $fake->numberBetween(0, 10),
                "isImmeubleParking" => (string) $fake->numberBetween(0, 2),
                "isParkingIsolate" => (string) $fake->numberBetween(0, 2),
                "age1" => (string) $fake->numberBetween(50, 100),
                "age2" => (string) $fake->numberBetween(50, 100),

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

                "price" => (string) $fake->randomFloat(2),
                "priceHt" => (string) $fake->randomFloat(2),
                "pricePlafond" => (string) $fake->randomFloat(2),
                "provisionCharges" => (string) $fake->randomFloat(2),
                "caution" => (string) $fake->randomFloat(2),
                "honoraireTtc" => (string) $fake->randomFloat(2),
                "edl" => (string) $fake->randomFloat(2),
                "typeCharges" => $fake->numberBetween(0, 2),
                "totalGeneral" => (string) $fake->randomFloat(2),
                "typeBail" => $fake->numberBetween(0, 3),
                "durationBail" => (string) $fake->numberBetween(0,5),
                "complementLoyer" => (string) $fake->randomFloat(2),

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

                "priceMurs" => (string) $fake->randomFloat(2),
                "rente" => (string) $fake->randomFloat(2),
                "repartitionCa" => "70% bar / 30% restaurant",
                "resultatN2" => (string) $fake->randomNumber(5),
                "resultatN1" => (string) $fake->randomNumber(5),
                "resultatN0" => (string) $fake->randomNumber(5),
                "natureBailCommercial" => "Tous commerces sauf restauration",

                "inform" => $fake->numberBetween(0, 2),
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
                "priceEstimate" => $fake->randomFloat(2),
                "fee" => $fake->randomFloat(1),
                "mandatRaison" => $fake->streetName,
                "mandatLastname" => $fake->lastName,
                "mandatFirstname" => $fake->firstName,
                "mandatPhone" => $fake->e164PhoneNumber,
                "mandatAddress" => $fake->streetName,
                "mandatZipcode" => $fake->postcode,
                "mandatCity" => $fake->city,
                "mandatCommentary" => $fake->sentence,
            ];

            $data = json_decode(json_encode($data));

            $agency = $this->immoService->getUserAgency($user);

            $advert         = $this->dataImmo->setDataAdvert(new ImAdvert(), $data);
            $confidential   = $this->dataImmo->setDataConfidential(new ImConfidential(), $data);
            $financial      = $this->dataImmo->setDataFinancial(new ImFinancial(), $data);
            $localisation   = $this->dataImmo->setDataLocalisation(new ImLocalisation(), $data);
            $diag           = $this->dataImmo->setDataDiag(new ImDiag(), $data);
            $advantage      = $this->dataImmo->setDataAdvantage(new ImAdvantage(), $data);
            $feature        = $this->dataImmo->setDataFeature(new ImFeature(), $data);
            $number         = $this->dataImmo->setDataNumber(new ImNumber(), $data);
            $area           = $this->dataImmo->setDataArea(new ImArea(), $data);
            $mandat         = $this->dataImmo->setDataMandat($this->immoService, new ImMandat(), $data, $agency);

            $obj = $this->dataImmo->setDataBien($agency, new ImBien(), $data, $area, $number, $feature, $advantage, $diag,
                $localisation, $financial, $confidential, $advert, $mandat, []);

            $choicesOwners = [];
            foreach($owners as $ow){
                if($ow->getNegotiator() && $ow->getNegotiator()->getAgency()->getId() == $agency->getId()){
                    $choicesOwners[] = $ow;
                }
            }
            $owner = null;
            if(count($choicesOwners) > 0){
                $owner = $choicesOwners[$fake->numberBetween(0,count($choicesOwners) - 1)];

                $contract = (new ImContract())
                    ->setNegotiator($negotiator)
                    ->setBien($obj)
                ;

                $emT->persist($contract);

                $contractant = (new ImContractant())
                    ->setContract($contract)
                    ->setOwner($owner)
                ;

                $emT->persist($contractant);
            }

            $obj = ($obj)
                ->setReference(uniqid())
                ->setUserId($user->getId())
                ->setCreatedBy($user->getShortFullName())
                ->setIdentifiant(mb_strtoupper(uniqid().bin2hex(random_bytes(4))) . $i)
                ->setSlug(uniqid())
                ->setAgency($agency)
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

            $emT->persist($obj);
        }
        $io->text('BIENS : Biens fake cr????s' );

        $emT->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

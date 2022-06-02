<?php

namespace App\Command\Donnee;

use App\Transaction\Entity\Immo\ImAdvantage;
use App\Transaction\Entity\Immo\ImAdvert;
use App\Transaction\Entity\Immo\ImArea;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImConfidential;
use App\Transaction\Entity\Immo\ImDiag;
use App\Transaction\Entity\Immo\ImFeature;
use App\Transaction\Entity\Immo\ImFinancial;
use App\Transaction\Entity\Immo\ImLocalisation;
use App\Transaction\Entity\Immo\ImMandat;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImNumber;
use App\Entity\User;
use App\Service\Data\DataImmo;
use App\Service\Immo\ImmoService;
use App\Service\SanitizeData;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use PhpOffice\PhpSpreadsheet\Reader\Csv;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DonneeGeranceSyncCommand extends Command
{
    protected static $defaultName = 'donnee:gerance:sync';
    protected static $defaultDescription = 'Sync data gérance';
    private $em;
    private $privateDirectory;
    private $dataImmo;
    private $immoService;
    private $sanitizeData;

    public function __construct(EntityManagerInterface $entityManager, $privateDirectory, DataImmo $dataImmo,
                                ImmoService $immoService, SanitizeData $sanitizeData)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->privateDirectory = $privateDirectory;
        $this->dataImmo = $dataImmo;
        $this->immoService = $immoService;
        $this->sanitizeData = $sanitizeData;
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Synchronisation de la gérance');

        $importFile = $this->getPrivateDirectory() . "import/gerance/TRANSAC.csv";
        if(!file_exists($importFile)){
            $io->text("Fichier introuvable.");
            return Command::FAILURE;
        }

        $reader = new Csv();
        $spreadsheet = $reader->load($importFile);

        $sheetData = $spreadsheet->getActiveSheet()->toArray();

        $progressBar = new ProgressBar($output, count($sheetData));
        $progressBar->start();


        $user = $this->em->getRepository(User::class)->findOneBy(['username' => "shanbo"]);
        $negotiator = $this->em->getRepository(ImNegotiator::class)->findOneBy(['agency' => $user->getAgencyId()]);

        $first = true;
        foreach($sheetData as $item){
            if($first){
                $first = false;
            }else{
                dump($item[5]);

                // TODO MAIN NEGOTIATOR

//                $data = [
//                    "codeTypeAd" => ImBien::AD_LOCATION,
//                    "codeTypeBien" => ImBien::BIEN_APPARTEMENT,
//                    "libelle" => "Appartement",
//                    "negotiator" => $negotiator->getId(),
//                    "areaTotal" => $item[6],
//                    "areaHabitable" => $item[6],
//                    "areaLand" => null,
//                    "areaGarden" => null,
//                    "areaTerrace" => null,
//                    "areaCave" => null,
//                    "areaBathroom" => null,
//                    "areaLiving" => null,
//                    "areaDining" => null,
//                    "piece" => (string) $fake->randomDigit(),
//                    "room" => (string) $fake->randomDigit(),
//                    "bathroom" => (string) $fake->randomDigit(),
//                    "wc" => (string) $fake->randomDigit(),
//                    "balcony" => (string) $fake->randomDigit(),
//                    "parking" => (string) $fake->randomDigit(),
//                    "box" => (string) $fake->randomDigit(),
//                    "dispoAt" => null,
//                    "buildAt" => $fake->numberBetween(1600, 2021),
//                    "busy" => $item[14] != "Pas de locataire" ? 1 : 0,
//                    "isMeuble" => $answers[$fake->numberBetween(0,2)],
//                    "isNew" => $answers[$fake->numberBetween(0,2)],
//                    "floor" => $item[10],
//                    "nbFloor" => $item[39],
//                    "codeHeater0" => $fake->numberBetween(0, 1),
//                    "codeHeater" => $fake->numberBetween(0, 15),
//                    "codeKitchen" => $fake->numberBetween(0, 8),
//                    "isWcSeparate" => $answers[$fake->numberBetween(0,2)],
//                    "codeWater" =>  $fake->numberBetween(0, 1),
//                    "exposition" => (string) $fake->numberBetween(0, 5),
//                    "hasGarden" => $answers[$fake->numberBetween(0,2)],
//                    "hasTerrace" => $answers[$fake->numberBetween(0,2)],
//                    "hasPool" => $answers[$fake->numberBetween(0,2)],
//                    "hasCave" => $answers[$fake->numberBetween(0,2)],
//                    "hasDigicode" => $answers[$fake->numberBetween(0,2)],
//                    "hasInterphone" => $answers[$fake->numberBetween(0,2)],
//                    "hasGuardian" => $answers[$fake->numberBetween(0,2)],
//                    "hasAlarme" => $answers[$fake->numberBetween(0,2)],
//                    "hasLift" => $answers[$fake->numberBetween(0,2)],
//                    "hasClim" => $answers[$fake->numberBetween(0,2)],
//                    "hasCalme" => $answers[$fake->numberBetween(0,2)],
//                    "hasInternet" => $answers[$fake->numberBetween(0,2)],
//                    "hasHandi" => $answers[$fake->numberBetween(0,2)],
//                    "hasFibre" => $answers[$fake->numberBetween(0,2)],
//                    "situation" => $fake->name,
//                    "sousType" => $fake->numberBetween(0, 10),
//                    "sol" => $fake->numberBetween(0, 4),
//                    "beforeJuly" => 1,
//                    "isVirgin" => 0,
//                    "isSend" => 0,
//                    "createdAtDpe" => $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
//                    "referenceDpe" => $fake->numberBetween(1600, 2021),
//                    "dpeLetter" => (string) $fake->numberBetween(0, 6),
//                    "gesLetter" => (string) $fake->numberBetween(0, 6),
//                    "dpeValue" => (string) $fake->numberBetween(0, 350),
//                    "gesValue" => (string) $fake->numberBetween(0, 350),
//                    "minAnnual" => (string) $fake->numberBetween(0, 10000),
//                    "maxAnnual" => (string) $fake->numberBetween(0, 10000),
//                    "address" => $this->sanitizeData->trimData($item[1] . " " . $item[2]),
//                    "hideAddress" => 1,
//                    "zipcode" => $this->sanitizeData->trimData($item[3]),
//                    "city" => $this->sanitizeData->trimData($item[4]),
//                    "country" => $fake->country,
//                    "departement" => $fake->citySuffix,
//                    "quartier" => $fake->streetName,
//                    "lat" => (string) $fake->latitude,
//                    "lon" => (string) $fake->longitude,
//                    "hideMap" => $fake->numberBetween(0, 1),
//                    "price" => $item[17],
//                    "provisionCharges" => $item[18],
//                    "caution" => (string) $fake->randomFloat(2),
//                    "honoraireTtc" => (string) $fake->randomFloat(2),
//                    "edl" => (string) $fake->randomFloat(2),
//                    "typeCharges" => $fake->numberBetween(0, 2),
//                    "totalGeneral" => (string) $fake->randomFloat(2),
//                    "typeBail" => $fake->numberBetween(0, 3),
//                    "durationBail" => null,
//                    "chargesMensuelles" => (string) $fake->randomFloat(2),
//                    "notaire" => (string) $fake->randomFloat(2),
//                    "foncier" => (string) $fake->randomFloat(2),
//                    "taxeHabitation" => (string) $fake->randomFloat(2),
//                    "honoraireChargeDe" => $fake->numberBetween(0,2),
//                    "honorairePourcentage" => (string) $fake->randomFloat(2),
//                    "priceHorsAcquereur" => (string) $fake->randomFloat(2),
//                    "isCopro" => $fake->numberBetween(0,1),
//                    "nbLot" => $fake->numberBetween(0, 500),
//                    "chargesLot" => (string) $fake->randomFloat(2),
//                    "isSyndicProcedure" => $fake->numberBetween(0,1),
//                    "detailsProcedure" => $fake->sentence,
//                    "inform" => $fake->numberBetween(0, 3),
//                    "lastname" => $fake->lastName,
//                    "phone1" => $fake->e164PhoneNumber,
//                    "email" => $fake->email,
//                    "visiteAt" => $fake->numberBetween(0,1) == 1 ? $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z") : null,
//                    "keysNumber" => $fake->randomNumber(1),
//                    "keysWhere" => $fake->streetName,
//                    "typeAdvert" => $fake->numberBetween(0, 2),
//                    "contentSimple" => $fake->text,
//                    "contentFull" => $fake->sentence(255),
//                    "isDraft" => $isArchived ? false : $isDraft,
//                    "codeTypeMandat" => (string) $fake->numberBetween(0, 3),
//                    "startAt" => $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
//                    "endAt" => $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
//                    "priceEstimate" => $fake->randomFloat(2),
//                    "fee" => $fake->randomFloat(1),
//                    "mandatRaison" => $fake->streetName,
//                    "mandatLastname" => $fake->lastName,
//                    "mandatFirstname" => $fake->firstName,
//                    "mandatPhone" => $fake->e164PhoneNumber,
//                    "mandatAddress" => $fake->streetName,
//                    "mandatZipcode" => $fake->postcode,
//                    "mandatCity" => $fake->city,
//                    "mandatCommentary" => $fake->sentence,
//                ];
//
//                $data = json_decode(json_encode($data));
//
//                $advert         = $this->dataImmo->setDataAdvert(new ImAdvert(), $data);
//                $confidential   = $this->dataImmo->setDataConfidential(new ImConfidential(), $data);
//                $financial      = $this->dataImmo->setDataFinancial(new ImFinancial(), $data);
//                $localisation   = $this->dataImmo->setDataLocalisation(new ImLocalisation(), $data);
//                $diag           = $this->dataImmo->setDataDiag(new ImDiag(), $data);
//                $advantage      = $this->dataImmo->setDataAdvantage(new ImAdvantage(), $data);
//                $feature        = $this->dataImmo->setDataFeature(new ImFeature(), $data);
//                $number         = $this->dataImmo->setDataNumber(new ImNumber(), $data);
//                $area           = $this->dataImmo->setDataArea(new ImArea(), $data);
//                $mandat         = $this->dataImmo->setDataMandat($this->immoService, new ImMandat(), $data, $user->getAgency());
//
//                $obj = $this->dataImmo->setDataBien($this->immoService, $user->getAgency(), new ImBien(), $data, $area, $number, $feature, $advantage, $diag,
//                    $localisation, $financial, $confidential, $advert, $mandat, []);
//
//                $obj = ($obj)
//                    ->setUser($user)
//                    ->setCreatedBy($user->getShortFullName())
//                    ->setIdentifiant(mb_strtoupper(uniqid().bin2hex(random_bytes(4))) . $i)
//                    ->setAgency($user->getAgency())
//                    ->setOwner($owner)
//                    ->setIsGerance(true)
//                    ->setReferenceGerance($item[0])
//                ;

                $progressBar->advance();
            }
        }

        $progressBar->finish();
//        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }

    public function getPrivateDirectory()
    {
        return $this->privateDirectory;
    }
}

<?php

namespace App\Command\Fake;

use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImSearch;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Service\Data\DataImmo;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeProspectsCreate extends Command
{
    protected static $defaultName = 'fake:prospects:create';
    protected $em;
    private $databaseService;
    private $dataImmo;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService, DataImmo $dataImmo)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataImmo = $dataImmo;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create fake prospects.')
        ;
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [ImSearch::class, ImSuivi::class, ImProspect::class]);

        $agencies = $this->em->getRepository(ImAgency::class)->findAll();
        $nbAgencies = count($agencies);
        $negotiators = $this->em->getRepository(ImNegotiator::class)->findAll();
        $nbNegotiators = count($negotiators);

        if($nbNegotiators == 0 || $nbAgencies == 0){
            $io->text("Veuillez créer un ou des négociateurs/agences avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 1000 prospects fake');
        $fake = Factory::create();
        for($i=0; $i<1000 ; $i++) {
            $agency = $agencies[$fake->numberBetween(0,$nbAgencies - 1)];

            $negotiators = $agency->getNegotiators();
            $nbNegotiators = count($negotiators);

            $negotiator = "";
            if($fake->numberBetween(0,1) == 1){
                $n = $negotiators[$fake->numberBetween(0,$nbNegotiators - 1)];
                if($n){
                    $negotiator = $n->getId();
                }
            }

            $data = [
                "agency" => $agency->getId(),
                "negotiator" => $negotiator,
                "lastname" => $fake->lastName,
                "firstname" => $fake->firstName,
                "civility" => $fake->numberBetween(0, 1),
                "email" => $fake->email,
                "phone1" => $fake->e164PhoneNumber,
                "phone2" => $fake->e164PhoneNumber,
                "phone3" => $fake->e164PhoneNumber,
                "address" => $fake->streetName,
                "complement" => "",
                "zipcode" => $fake->postcode,
                "city" => $fake->city,
                "birthday" => $fake->numberBetween(0,1) == 1 ? $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z") : null,
                "lastContactAt" => $fake->numberBetween(0,1) == 1 ? $fake->date("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z") : null,
                "type" => $fake->numberBetween(0, 4),
                "status" => $fake->numberBetween(0, 4),
                "commentary" => $fake->sentence
            ];

            $data = json_decode(json_encode($data));

            $new = $this->dataImmo->setDataProspect($em, new ImProspect(), $data);

            $new->setIsArchived($fake->numberBetween(0, 1));

            $this->em->persist($new);
        }
        $io->text('PROSPECTS : Prospects fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

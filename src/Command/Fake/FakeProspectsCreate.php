<?php

namespace App\Command\Fake;

use App\Entity\Society;
use App\Entity\User;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImSearch;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Service\Data\DataImmo;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeProspectsCreate extends Command
{
    protected static $defaultName = 'fake:prospects:create';
    private $em;
    private $registry;
    private $databaseService;
    private $dataImmo;

    public function __construct(ManagerRegistry $registry, DatabaseService $databaseService, DataImmo $dataImmo)
    {
        parent::__construct();

        $this->em = $registry->getManager();
        $this->registry = $registry;
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
        $societies = $this->em->getRepository(Society::class)->findAll();
        foreach($societies as $society){
            $this->databaseService->resetTable($io, $society->getManager(), [
                ImSearch::class, ImSuivi::class, ImProspect::class
            ]);
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->text("Veuillez créer l'user SHANBO avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $emT = $this->registry->getManager($user->getManager());

        $agencies    = $emT->getRepository(ImAgency::class)->findAll();
        $negotiators = $emT->getRepository(ImNegotiator::class)->findAll();

        $nbAgencies     = count($agencies);
        $nbNegotiators  = count($negotiators);

        if($nbNegotiators == 0 || $nbAgencies == 0){
            $io->text("Veuillez créer un ou des négociateurs/agences avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 500 prospects fake');
        $fake = Factory::create();
        for($i=0; $i<500 ; $i++) {
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

            $new = $this->dataImmo->setDataProspect($emT, new ImProspect(), $data);

            $new->setIsArchived($fake->numberBetween(0, 1));

            $emT->persist($new);
        }
        $io->text('PROSPECTS : Prospects fake créés' );

        $emT->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

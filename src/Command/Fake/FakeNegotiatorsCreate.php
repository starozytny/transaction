<?php

namespace App\Command\Fake;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOwner;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeNegotiatorsCreate extends Command
{
    protected static $defaultName = 'fake:negotiators:create';
    protected $em;
    private $databaseService;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create fake negotiators.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [ImBien::class, ImOwner::class, ImNegotiator::class]);

        $agencies = $this->em->getRepository(ImAgency::class)->findAll();
        $nbAgencies = count($agencies);

        if($nbAgencies == 0){
            $io->text("Veuillez créer un ou des agences avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 30 négociateurs fake');
        $fake = Factory::create();
        for($i=0; $i<30 ; $i++) {
            $agency = $agencies[$fake->numberBetween(0,$nbAgencies - 1)];

            $lastname = $fake->lastName;
            $firstname = $fake->firstName;

            $code = substr($lastname, 0,1) . substr($firstname, 0, 1);

            $new = (new ImNegotiator())
                ->setAgency($agency)
                ->setCode($code)
                ->setLastname($lastname)
                ->setFirstname($firstname)
                ->setPhone($fake->e164PhoneNumber)
                ->setPhone2($fake->e164PhoneNumber)
                ->setEmail($fake->email)
                ->setTransport($fake->numberBetween(0, 4))
                ->setImmatriculation($fake->randomNumber(7))
            ;

            $this->em->persist($new);
        }
        $io->text('NEGOTIATORS : Négociateurs fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

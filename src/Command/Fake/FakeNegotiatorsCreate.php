<?php

namespace App\Command\Fake;

use App\Entity\Society;
use App\Entity\User;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImOwner;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImTenant;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeNegotiatorsCreate extends Command
{
    protected static $defaultName = 'fake:negotiators:create';
    private $em;
    private $registry;
    private $databaseService;

    public function __construct(ManagerRegistry $registry, DatabaseService $databaseService)
    {
        parent::__construct();


        $this->em = $registry->getManager();
        $this->registry = $registry;
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
        $societies = $this->em->getRepository(Society::class)->findAll();
        foreach($societies as $society){
            $this->databaseService->resetTable($io, $society->getManager(), [
                ImProspect::class,
                ImBien::class,
                ImTenant::class,
                ImOwner::class,
                ImNegotiator::class
            ]);
        }


        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->text("Veuillez créer l'user SHANBO avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $emT = $this->registry->getManager($user->getManager());

        $agencies = $emT->getRepository(ImAgency::class)->findAll();
        $nbAgencies = count($agencies);

        if($nbAgencies == 0){
            $io->text("Veuillez créer un ou des agences avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 500 négociateurs fake');
        $fake = Factory::create();
        for($i=0; $i<500 ; $i++) {
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

            $emT->persist($new);
        }
        $io->text('NEGOTIATORS : Négociateurs fake créés' );

        $emT->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

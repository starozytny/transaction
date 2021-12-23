<?php

namespace App\Command;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOwner;
use App\Entity\Society;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeOwnersCreate extends Command
{
    protected static $defaultName = 'fake:owners:create';
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
            ->setDescription('Create fake owners.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [ImBien::class, ImOwner::class]);

        $societies = $this->em->getRepository(Society::class)->findAll();
        $nbSocieties = count($societies);
        $negotiators = $this->em->getRepository(ImNegotiator::class)->findAll();
        $nbNegotiators = count($negotiators);

        if($nbSocieties == 0 || $nbNegotiators == 0){
            $io->text("Veuillez créer un ou des sociétés/négociateurs avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 30 propriétaires fake');
        $fake = Factory::create();
        for($i=0; $i<30 ; $i++) {
            $society = $societies[$fake->numberBetween(0,$nbSocieties - 1)];

            $lastname = $fake->lastName;
            $firstname = $fake->firstName;

            $code = substr($lastname, 0,1) . substr($firstname, 0, 1) . time();

            $new = (new ImOwner())
                ->setSociety($society)
                ->setCode($code)
                ->setLastname(mb_strtoupper($lastname))
                ->setFirstname($firstname)
                ->setCivility($fake->numberBetween(0, 4))
                ->setPhone1($fake->e164PhoneNumber)
                ->setPhone2($fake->e164PhoneNumber)
                ->setPhone3($fake->e164PhoneNumber)
                ->setEmail($fake->email)
                ->setAddress($fake->streetName)
                ->setZipcode($fake->postcode)
                ->setCity($fake->city)
                ->setCountry($fake->country)
                ->setCategory($fake->numberBetween(0, 3))

            ;

            if($fake->numberBetween(0,1) == 1){
                $new = ($new)
                    ->setIsGerance(true)
                    ->setCodeGerance(time())
                    ->setFolderGerance(time())
                ;
            }

            if($fake->numberBetween(0,1) == 1){
                $new = ($new)
                    ->setIsCoIndivisaire(true)
                    ->setCoLastname(mb_strtoupper($fake->lastName))
                    ->setCoFirstname($fake->firstName)
                    ->setCoPhone($fake->e164PhoneNumber)
                    ->setCoEmail($fake->email)
                    ->setCoAddress($fake->streetName)
                    ->setCoZipcode($fake->postcode)
                    ->setCoCity($fake->city)
                ;
            }

            if($fake->numberBetween(0,1) == 1){
                $new = ($new)
                    ->setNegotiator($negotiators[$fake->numberBetween(0,$nbNegotiators - 1)])
                ;
            }

            $this->em->persist($new);
        }
        $io->text('OWNERS : Propriétaires fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

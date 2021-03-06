<?php

namespace App\Command\Fake;

use App\Entity\User;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImOwner;
use App\Transaction\Entity\Immo\ImPublish;
use App\Transaction\Entity\Immo\ImRoom;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Transaction\Entity\Immo\ImVisit;
use App\Entity\Society;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeOwnersCreate extends Command
{
    protected static $defaultName = 'fake:owners:create';
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
            ->setDescription('Create fake owners.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $societies = $this->em->getRepository(Society::class)->findAll();
        foreach($societies as $society) {
            $this->databaseService->resetTable($io, $society->getManager(), [
                ImPublish::class,
                ImSuivi::class,
                ImVisit::class,
                ImRoom::class,
                ImBien::class,
                ImOwner::class
            ]);
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->text("Veuillez cr??er l'user SHANBO avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $emT = $this->registry->getManager($user->getManager());

        $agencies    = $emT->getRepository(ImAgency::class)->findAll();
        $negotiators = $emT->getRepository(ImNegotiator::class)->findAll();

        $nbAgencies    = count($agencies);
        $nbNegotiators = count($negotiators);

        if($nbNegotiators == 0 || $nbAgencies == 0){
            $io->text("Veuillez cr??er un ou des soci??t??s/n??gociateurs/agences avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Cr??ation de 600 propri??taires fake');
        $fake = Factory::create();
        for($i=0; $i<600 ; $i++) {

            $agency = $agencies[$fake->numberBetween(0,$nbAgencies - 1)];

            $negotiators = $agency->getNegotiators();
            $nbNegotiators = count($negotiators);

            $lastname = $fake->lastName;
            $firstname = $fake->firstName;

            $code = substr($lastname, 0,1) . substr($firstname, 0, 1) . time();

            $new = (new ImOwner())
                ->setAgency($agency)
                ->setCode($code)
                ->setLastname(mb_strtoupper($lastname))
                ->setFirstname($firstname)
                ->setCivility($fake->numberBetween(0, 2))
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
                ;
            }

            if($fake->numberBetween(0,1) == 1){
                if($negotiator = $negotiators[$fake->numberBetween(0,$nbNegotiators - 1)]){
                    $new = ($new)
                        ->setNegotiator($negotiator)
                    ;
                }
            }

            $emT->persist($new);
        }
        $io->text('OWNERS : Propri??taires fake cr????s' );

        $emT->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

<?php

namespace App\Command\Fake;

use App\Entity\Society;
use App\Entity\User;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImTenant;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeTenantsCreate extends Command
{
    protected static $defaultName = 'fake:tenants:create';
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
            ->setDescription('Create fake tenants.')
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
                ImBien::class, ImTenant::class
            ]);
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->text("Veuillez créer l'user SHANBO avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $emT = $this->registry->getManager($user->getManager());

        $agencies       = $emT->getRepository(ImAgency::class)->findAll();
        $negotiators    = $emT->getRepository(ImNegotiator::class)->findAll();

        $nbAgencies     = count($agencies);
        $nbNegotiators  = count($negotiators);

        if($nbNegotiators == 0 || $nbAgencies == 0){
            $io->text("Veuillez créer un ou des négociateurs/agences avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 500 locataires fake');
        $fake = Factory::create();
        for($i=0; $i<500 ; $i++) {
            $agency = $agencies[$fake->numberBetween(0,$nbAgencies - 1)];

            $negotiators = $agency->getNegotiators();
            $nbNegotiators = count($negotiators);

            $lastname = $fake->lastName;
            $firstname = $fake->firstName;

            $new = (new ImTenant())
                ->setAgency($agency)
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
                ->setBirthday($fake->numberBetween(0, 1) == 1 ? new \DateTime($fake->date("Y-m-d")) : null)
            ;

            if($fake->numberBetween(0,1) == 1){
                if($negotiator = $negotiators[$fake->numberBetween(0,$nbNegotiators - 1)]){
                    $new = ($new)
                        ->setNegotiator($negotiator)
                    ;
                }
            }

            $emT->persist($new);
        }
        $io->text('TENANTS : Locataires fake créés' );

        $emT->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

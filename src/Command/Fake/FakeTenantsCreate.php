<?php

namespace App\Command\Fake;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImTenant;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use function App\Command\mb_strtoupper;

class FakeTenantsCreate extends Command
{
    protected static $defaultName = 'fake:tenants:create';
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
        $this->databaseService->resetTable($io, [ImBien::class, ImTenant::class]);

        $agencies = $this->em->getRepository(ImAgency::class)->findAll();
        $nbAgencies = count($agencies);
        $negotiators = $this->em->getRepository(ImNegotiator::class)->findAll();
        $nbNegotiators = count($negotiators);

        if($nbNegotiators == 0 || $nbAgencies == 0){
            $io->text("Veuillez créer un ou des négociateurs/agences avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 30 locataires fake');
        $fake = Factory::create();
        for($i=0; $i<30 ; $i++) {
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

            $this->em->persist($new);
        }
        $io->text('TENANTS : Locataires fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

<?php

namespace App\Command;

use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImOwner;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImSettings;
use App\Transaction\Entity\Immo\ImStat;
use App\Transaction\Entity\Immo\ImSupport;
use App\Transaction\Entity\Immo\ImTenant;
use App\Entity\Mail;
use App\Entity\Notification;
use App\Entity\Society;
use App\Entity\User;
use App\Service\Data\DataImmo;
use App\Service\Data\Society\DataSociety;
use App\Service\DatabaseService;
use App\Service\Immo\ImmoService;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AdminUsersCreateCommand extends Command
{
    protected static $defaultName = 'admin:users:create';
    private $em;
    private $registry;
    private $databaseService;
    private $dataSociety;
    private $immoService;
    private $dataImmo;

    const NAME_MANAGER = "transac1";

    public function __construct(ManagerRegistry $registry, DatabaseService $databaseService,
                                DataSociety $dataSociety, DataImmo $dataImmo, ImmoService $immoService)
    {
        parent::__construct();

        $this->em = $registry->getManager();
        $this->registry = $registry;
        $this->databaseService = $databaseService;
        $this->dataSociety = $dataSociety;
        $this->immoService = $immoService;
        $this->dataImmo = $dataImmo;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create an user and an admin.')
            ->addOption('fake', "f", InputOption::VALUE_NONE, 'Option shit values')
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
                ImStat::class,
                ImTenant::class,
                ImSupport::class,
                ImOwner::class,
                ImProspect::class,
                ImNegotiator::class,
                ImSettings::class,
                ImAgency::class,
            ]);
        }
        $this->databaseService->resetTable($io, "default", [
            Mail::class,
            Notification::class,
            User::class,
            Society::class
        ]);

        $users = array(
            [
                'username' => 'shanbo',
                'firstname' => 'Dev',
                'lastname' => 'Shanbora',
                'email' => 'chanbora.chhun@outlook.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN', 'ROLE_DEVELOPER']
            ],
            [
                'username' => 'staro',
                'firstname' => 'Admin',
                'lastname' => 'Starozytny',
                'email' => 'starozytny@hotmail.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN']
            ],
            [
                'username' => 'shanks',
                'firstname' => 'User',
                'lastname' => 'Shanks',
                'email' => 'shanks@hotmail.fr',
                'roles' => ['ROLE_USER']
            ],
            [
                'username' => 'manager',
                'firstname' => 'Manager',
                'lastname' => 'Shan',
                'email' => 'chanbora.manager@outlook.fr',
                'roles' => ['ROLE_USER', 'ROLE_MANAGER']
            ],
        );

        $password = password_hash("azerty", PASSWORD_ARGON2I);

        $io->title('Création de la société Logilink');
        $society = (new Society())
            ->setName("Logilink")
            ->setCode(0)
            ->setManager(self::NAME_MANAGER)
        ;

        $this->em->persist($society);
        $io->text('SOCIETE : Logilink créée' );

        $io->title('Création de l\'agence Logilink');
        $agency = (new ImAgency())
            ->setManager(self::NAME_MANAGER)
            ->setCode("LO0")
            ->setName("Logilink")
            ->setDirname('logilinkZip')
            ->setWebsite('logilink.fr')
            ->setEmail('chanbora@logilink.fr')
            ->setEmailLocation('chanbora@logilink.fr')
            ->setEmailVente('chanbora@logilink.fr')
            ->setPhone('065204XXXX')
            ->setPhoneLocation('065204XXXX')
            ->setPhoneVente('065204XXXX')
            ->setAddress("17 rue de la République")
            ->setZipcode("13002")
            ->setCity("MARSEILLE 02")
            ->setLat("4")
            ->setLon("4")
            ->setIdentifiant('logilinkZip' . time())
            ->setType("Logilink")
            ->setSiret("307 772 269 000")
            ->setRcs("307 772 269")
            ->setCartePro("CPI 8550 250 666 546 789")
            ->setGarantie("Galian 140 000€")
            ->setAffiliation("FNAIM")
            ->setDescription(trim("
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut interdum scelerisque nisl 
                ac rutrum. Mauris in ex nibh. Donec tincidunt diam sit amet eros fringilla vehicula e
                t at arcu. Vestibulum iaculis arcu vitae hendrerit auctor. Morbi non libero velit. Al
                iquam erat volutpat. Pellentesque sodales, ex a facilisis sodales, sapien dui hendrer
                it orci, non posuere enim enim ut turpis. Aenean dolor nisl, mollis ac orci fermentum
                , imperdiet tincidunt est. Sed varius augue erat, lobortis vehicula quam volutpat et. 
            "))
        ;

        $negotiator = (new ImNegotiator())
            ->setAgency($agency)
            ->setIsDefault(true)
            ->setLastname("Logilink")
            ->setFirstname("Négociateur")
            ->setCode("LN")
        ;

        $emTransac = $this->registry->getManager(self::NAME_MANAGER);

        $emTransac->persist($negotiator);

        $setting = (new ImSettings())->setAgency($agency);
        $this->immoService->initiateSupport($agency);

        $emTransac->persist($setting);
        $emTransac->persist($agency);

        $io->text('AGENCE : Logilink créée' );
        $emTransac->flush();

        $io->title('Création des utilisateurs');
        foreach ($users as $user) {
            $new = (new User())
                ->setUsername($user['username'])
                ->setEmail($user['email'])
                ->setRoles($user['roles'])
                ->setFirstname(ucfirst($user['firstname']))
                ->setLastname(mb_strtoupper($user['lastname']))
                ->setPassword($password)
                ->setSociety($society)
                ->setNegotiatorId($negotiator->getId())
                ->setManager(self::NAME_MANAGER)
            ;

            $this->em->persist($new);
            $io->text('USER : ' . $user['username'] . ' créé' );
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

<?php

namespace App\Command;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBuyer;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOwner;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImSettings;
use App\Entity\Immo\ImStat;
use App\Entity\Immo\ImSupport;
use App\Entity\Immo\ImTenant;
use App\Entity\Mail;
use App\Entity\Notification;
use App\Entity\Society;
use App\Entity\User;
use App\Service\Data\DataImmo;
use App\Service\Data\Society\DataSociety;
use App\Service\DatabaseService;
use App\Service\Immo\ImmoService;
use Doctrine\ORM\EntityManagerInterface;
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
    private $databaseService;
    private $dataSociety;
    private $immoService;
    private $dataImmo;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService,
                                DataSociety $dataSociety, DataImmo $dataImmo, ImmoService $immoService)
    {
        parent::__construct();

        $this->em = $entityManager;
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
        $this->databaseService->resetTable($io, [
            ImStat::class,
            Mail::class,
            Notification::class,
            ImTenant::class,
            ImSupport::class,
            ImBuyer::class,
            ImOwner::class,
            ImProspect::class,
            ImNegotiator::class,
            User::class,
            ImSettings::class,
            ImAgency::class,
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
        ;

        $this->em->persist($society);
        $io->text('SOCIETE : Logilink créée' );

        $io->title('Création de l\'agence Logilink');
        $agency = (new ImAgency())
            ->setSociety($society)
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

        $this->em->persist($negotiator);

        $setting = (new ImSettings())->setAgency($agency);
        $this->immoService->initiateSupport($agency);

        $this->em->persist($setting);
        $this->em->persist($agency);

        $io->text('AGENCE : Logilink créée' );
        $this->em->flush();

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
                ->setAgency($agency)
                ->setNegotiatorId($negotiator->getId())
            ;

            $this->em->persist($new);
            $io->text('USER : ' . $user['username'] . ' créé' );
        }

        if ($input->getOption('fake')) {
            $io->title('Création de 10 société fake');
            $societies = [];
            $fake = Factory::create();
            for($i=0; $i<10 ; $i++) {
                $data = [
                    "name" => $fake->name,
                ];

                $data = json_decode(json_encode($data));

                $new = $this->dataSociety->setData(new Society(), $data, $i+1);

                $this->em->persist($new);
                $societies[] = $new;
            }
            $io->text('SOCIETE : Sociétés fake créées' );

            $this->em->flush();

            $io->title('Création de 20 agences fake');
            $agencies = [];
            $fake = Factory::create();
            for($i=0; $i<20 ; $i++) {
                $agenceSociety = $i == 0 ? $society : $societies[$fake->numberBetween(0,9)];

                $name = $fake->name;

                $data = [
                    "society" => $agenceSociety->getId(),
                    "name" => $name,
                    "dirname" => "fake-" . $i,
                    "website" => $fake->domainName,
                    "email" => $fake->email,
                    "emailLocation" => $fake->email,
                    "emailVente" => $fake->email,
                    "phone" => $fake->e164PhoneNumber,
                    "phoneLocation" => $fake->e164PhoneNumber,
                    "phoneVente" => $fake->e164PhoneNumber,
                    "address" => $fake->address,
                    "zipcode" => $fake->postcode,
                    "city" => $fake->city,
                    "lat" => $fake->randomFloat(5),
                    "lon" => $fake->randomFloat(5),
                    "description" => [
                        "html" => $fake->sentence
                    ],
                    "type" => $fake->streetName,
                    "siret" => "",
                    "rcs" => "",
                    "cartePro" => "",
                    "garantie" => "",
                    "affiliation" => "",
                    "mediation" => "",
                ];

                $data = json_decode(json_encode($data));

                $new = $this->dataImmo->setDataAgency(new ImAgency(), $data);

                $negotiator = (new ImNegotiator())
                    ->setAgency($new)
                    ->setIsDefault(true)
                    ->setLastname($name)
                    ->setFirstname("Négociateur")
                    ->setCode("N" . $i)
                ;

                $this->em->persist($negotiator);

                $setting = (new ImSettings())->setAgency($new);
                $this->immoService->initiateSupport($new);

                $this->em->persist($setting);
                $this->em->persist($new);

                $agencies[] = [
                    'agency' => $new,
                    'society' => $agenceSociety
                ];
            }
            $io->text('AGENCE : Agences fake créées' );
            $this->em->flush();

            $io->title('Création de 550 utilisateurs fake');
            $fake = Factory::create();
            for($i=0; $i<550 ; $i++) {
                $agency = $agencies[$fake->numberBetween(0,9)];
                $new = (new User())
                    ->setUsername($fake->userName . $i)
                    ->setEmail($fake->freeEmail)
                    ->setRoles(['ROLE_USER'])
                    ->setFirstname(ucfirst($fake->firstName))
                    ->setLastname(mb_strtoupper($fake->lastName))
                    ->setPassword($password)
                    ->setSociety($agency['society'])
                    ->setAgency($agency['agency'])
                ;

                $this->em->persist($new);
            }
            $io->text('USER : Utilisateurs fake créés' );
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}

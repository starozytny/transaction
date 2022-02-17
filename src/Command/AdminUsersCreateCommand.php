<?php

namespace App\Command;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImSettings;
use App\Entity\Notification;
use App\Entity\Society;
use App\Entity\User;
use App\Service\Data\Society\DataSociety;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
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

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService,
                                DataSociety $dataSociety)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataSociety = $dataSociety;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create an user and an admin.')
            ->addOption('fake', "f", InputOption::VALUE_NONE, 'Option shit values')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [
            Notification::class,
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

        $setting = (new ImSettings())->setAgency($agency);

        $this->em->persist($setting);
        $this->em->persist($agency);
        $io->text('AGENCE : Logilink créée' );

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

            $io->title('Création de 20 agences fake');
            $agencies = [];
            $fake = Factory::create();
            for($i=0; $i<20 ; $i++) {
                $agenceSociety = $i == 0 ? $society : $societies[$fake->numberBetween(0,9)];
                $new = (new ImAgency())
                    ->setSociety($agenceSociety)
                    ->setName($fake->name)
                    ->setDirname("fake-" . $i)
                    ->setWebsite($fake->domainName)
                    ->setEmail($fake->email)
                    ->setEmailLocation($fake->email)
                    ->setEmailVente($fake->email)
                    ->setPhone($fake->e164PhoneNumber)
                    ->setPhoneLocation($fake->e164PhoneNumber)
                    ->setPhoneVente($fake->e164PhoneNumber)
                    ->setAddress($fake->address)
                    ->setZipcode($fake->postcode)
                    ->setCity($fake->city)
                    ->setLat($fake->randomFloat(5))
                    ->setLon($fake->randomFloat(5))
                    ->setIdentifiant("fake-" . $i . time())
                    ->setType($fake->name)
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

                $setting = (new ImSettings())->setAgency($new);

                $this->em->persist($setting);
                $this->em->persist($new);

                $agencies[] = [
                    'agency' => $new,
                    'society' => $agenceSociety
                ];
            }
            $io->text('AGENCE : Agences fake créées' );

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

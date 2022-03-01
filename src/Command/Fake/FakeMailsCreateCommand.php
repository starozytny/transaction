<?php

namespace App\Command\Fake;

use App\Entity\Mail;
use App\Entity\User;
use App\Service\Data\DataMail;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeMailsCreateCommand extends Command
{
    protected static $defaultName = 'fake:mails:create';
    protected static $defaultDescription = 'Create fake mails';
    private $em;
    private $databaseService;
    private $dataEntity;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService, DataMail $dataEntity)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataEntity = $dataEntity;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [Mail::class]);

        $users = $this->em->getRepository(User::class)->findAll();


        $io->title('Création de 110 mails fake');
        $fake = Factory::create();
        for($i=0; $i<110 ; $i++) {

            $data = [
                'subject' => $fake->name,
                'expeditor' => $fake->email,
                'destinators' => [$fake->email, $fake->email],
                'message' => [
                    'html' => "<p>" . $fake->sentence ." <b>Test</b> " . $fake->streetName .". </p>"
                ]
            ];

            $data = json_decode(json_encode($data));

            $new = $this->dataEntity->setData(new Mail(), $data);

            $user = $users[$fake->numberBetween(0, count($users) - 1)];
            $new->setUser($user);

            $this->em->persist($new);
        }
        $io->text('MAILS : Mails fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}

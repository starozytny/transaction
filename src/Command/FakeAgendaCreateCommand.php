<?php

namespace App\Command;

use App\Entity\Agenda\AgSlot;
use App\Entity\User;
use App\Service\Data\Agenda\DataSlot;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeAgendaCreateCommand extends Command
{
    protected static $defaultName = 'fake:agenda:create';
    protected static $defaultDescription = 'Create fake event of agenda';

    private $em;
    private $databaseService;
    private $dataSlot;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService, DataSlot $dataSlot)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataSlot = $dataSlot;
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [AgSlot::class]);

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->text("Veuillez créer l'user SHANBO avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 10 events');
        $fake = Factory::create();
        for($i=0; $i<10 ; $i++) {

            $start = $fake->dateTimeInInterval('-3 days', '+3 days');
            $end = $fake->dateTimeInInterval('-3 days', '+3 days');

            $data = [
                "name" => $fake->lastName,
                "startAt" => $fake->numberBetween(0,1) == 1 ? $start->format("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z") : null,
                "endAt" => $fake->numberBetween(0,1) == 1 ? $end->format("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z") : null,
                "allDay" => $fake->numberBetween(0, 1),
                "status" => $fake->numberBetween(0, 2),
                "location" => $fake->streetName,
                "comment" => $fake->sentence,
                "persons" => '{
                  "user": [
                    {
                      "id": 1
                    },
                    {
                      "id": 2
                    }
                  ],
                  "other": [
                    {
                      "id": 1
                    }  
                  ]
                }'
            ];

            $data = json_decode(json_encode($data));

            $new = $this->dataSlot->setDataSlot(new AgSlot(), $data);
            $new->setCreator($user);

            $this->em->persist($new);
        }
        $io->text('AGENDA : Slots fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}

<?php

namespace App\Command\Fake;

use App\Entity\Agenda\AgEvent;
use App\Entity\Immo\ImBien;
use App\Entity\User;
use App\Service\Data\Agenda\DataEvent;
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
    private $dataEvent;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService, DataEvent $dataEvent)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataEvent = $dataEvent;
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [AgEvent::class]);

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->text("Veuillez créer l'user SHANBO avant de lancer cette commande.");
            return Command::FAILURE;
        }
        $bien = $this->em->getRepository(ImBien::class)->findOneBy(['agency' => $user->getAgency()]);
        if(!$bien){
            $io->text("Veuillez créer un bien lié à l'agence de Shanbo avant de lancer cette commande.");
            return Command::FAILURE;
        }

        $io->title('Création de 10 events');
        $fake = Factory::create();
        for($i=0; $i<10 ; $i++) {

            $allDay = !($fake->numberBetween(0, 1) == 0);
            $start = $fake->dateTimeInInterval('-3 days', '+3 days');

            $end = null;
            if(!$allDay){
                $end = $fake->dateTimeInInterval($start, '+1 days');
                $end = $end->format("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z");
            }

            $users = [
                ["value" => $user->getId(), "label" => $user->getFullname(), "email" => $user->getEmail()],
            ];

            $data = [
                "name" => $fake->lastName,
                "startAt" => $start->format("Y-m-d\\TH\\:i\\:s\\.\\0\\0\\0\\Z"),
                "endAt" => $end,
                "allDay" => [$allDay],
                "status" => $fake->numberBetween(0, 3),
                "location" => $fake->streetName,
                "comment" => $fake->sentence,
                "users" => $users,
                "managers" => [],
                "negotiators" => [],
                "owners" => [],
                "tenants" => [],
                "prospects" => [],
                "buyers" => [],
                "visibilities" => [$fake->numberBetween(0, 3)],
            ];

            $data = json_decode(json_encode($data));

            $new = $this->dataEvent->setDataEvent(new AgEvent(), $data);
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

<?php

namespace App\Command\Donnee;

use App\Transaction\Entity\Donnee\DoQuartier;
use App\Transaction\Entity\Donnee\DoSol;
use App\Service\Data\Donnee\DataDonnee;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DonneeSolsInitCommand extends Command
{
    protected static $defaultName = 'donnee:sols:init';
    protected static $defaultDescription = 'Initiate data sols';
    private $em;
    private $dataDonnee;
    private $databaseService;

    public function __construct(EntityManagerInterface $entityManager, DataDonnee $dataDonnee, DatabaseService $databaseService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->dataDonnee = $dataDonnee;
        $this->databaseService = $databaseService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

//        $io->title('Reset des tables');
//        $this->databaseService->resetTable($io, [DoSol::class]);

        $objs = $this->em->getRepository(DoSol::class)->findBy(['isNative' => true]);
        if(count($objs) > 1){
            $io->text("Sol déjà initialisé.");
            return Command::FAILURE;
        }

        $items = ["Carrelage", "Moquette", "Moquette et carrelage", "Parquet", "Synthétique", "Tomette",
            "Béton", "Béton ciré", "Parquet stratifié", "Lino", "Carreaux"];

        sort($items);

        $io->title('Création des sols');

        $progressBar = new ProgressBar($output, count($items));
        $progressBar->start();
        foreach($items as $item){

            $data = [
                "name" => $item,
            ];

            $data = json_decode(json_encode($data));

            $obj = $this->dataDonnee->setDataSol(new DoSol(), $data);
            $obj->setIsNative(true);

            $this->em->persist($obj);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}

<?php

namespace App\Command\Donnee;

use App\Entity\Donnee\DoQuartier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DonneeQuartierInitCommand extends Command
{
    protected static $defaultName = 'donnee:quartier:init';
    protected static $defaultDescription = 'Initiate data quartier';
    private $em;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();

        $this->em = $entityManager;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $quartiers = $this->em->getRepository(DoQuartier::class)->findBy(['isNative' => true]);
        if(count($quartiers) > 1){
            $io->text("Quartier déjà initialisé.");
            return Command::FAILURE;
        }




        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}

<?php

namespace App\Command\Test;

use App\Transaction\Entity\Immo\ImBien;
use App\Entity\User;
use App\Service\Immo\ImmoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class TestServiceImmoCommand extends Command
{
    protected static $defaultName = 'test:service:immo';
    protected static $defaultDescription = 'Test some function of immo service class';
    private $immoService;
    private $em;

    public function __construct(EntityManagerInterface $entityManager, ImmoService $immoService)
    {
        parent::__construct();

        $this->immoService = $immoService;
        $this->em = $entityManager;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->error("L'utilisateur n'existe pas.");
            return Command::FAILURE;
        }

        $io->title("[TEST] Référence");
        $reference = $this->immoService->getReference($user->getAgency(), ImBien::AD_VENTE);
        $io->text("Référence Vente : " . $reference);

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}

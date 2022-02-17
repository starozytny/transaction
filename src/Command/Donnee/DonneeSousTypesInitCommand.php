<?php

namespace App\Command\Donnee;

use App\Entity\Donnee\DoSousType;
use App\Service\Data\Donnee\DataDonnee;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DonneeSousTypesInitCommand extends Command
{
    protected static $defaultName = 'donnee:sous:init';
    protected static $defaultDescription = 'Initiate data sous type de biens';
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
//        $this->databaseService->resetTable($io, [DoSousType::class]);

        $objs = $this->em->getRepository(DoSousType::class)->findBy(['isNative' => true]);
        if(count($objs) > 1){
            $io->text("Sous types déjà initialisé.");
            return Command::FAILURE;
        }

        $items = [
            "Bastide", "Bastion", "Bergerie",
            "Cabanon", "Chalet", "Chambre de service", "Corps de ferme",
            "Demeure", "Domaine", "Duplex",
            "Echoppe", "Entrepôt", "Exploitation agricole", "Exploitation viticole",
            "Ferme", "Fermette",
            "Grange",
            "Ile", "Immeuble commercial", "Immeuble de bureaux", "Immeuble mixte",
            "Local d'activités", "Local de stockage", "Loft", "Lotissement",
            "Maison ancienne", "Maison basque", "Maison charentaise", "Maison contemporaine", "Maison d'architecte",
            "Maison d'hôte", "Maison de loisirs", "Maison de maître", "Maison de village", "Maison de ville",
            "Maison en pierre", "Maison jumelée", "Maison landaise", "Maison longère", "Maison provençale",
            "Maison traditionnelle", "Manoir", "Mas", "Mazet", "Moulin",
            "Pavillon", "Programme", "Propriété", "Propriété de chasse", "Propriété équestre",
            "Restauration", "Riad",
            "Studette",
            "Terrain agricole", "Terrain commercial", "Terrain de loisirs", "Terrain industriel", "Terrain viticole",
            "Toulousaine", "Triplex",
            "Villa"
        ];

        sort($items);

        $io->title('Création des sous types de biens');

        $progressBar = new ProgressBar($output, count($items));
        $progressBar->start();
        foreach($items as $item){

            $data = [
                "name" => $item,
            ];

            $data = json_decode(json_encode($data));

            $obj = $this->dataDonnee->setDataSousType(new DoSousType(), $data);
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

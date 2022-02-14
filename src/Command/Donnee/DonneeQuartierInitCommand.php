<?php

namespace App\Command\Donnee;

use App\Entity\Donnee\DoQuartier;
use App\Service\Data\Donnee\DataDonnee;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DonneeQuartierInitCommand extends Command
{
    protected static $defaultName = 'donnee:quartier:init';
    protected static $defaultDescription = 'Initiate data quartier';
    private $em;
    private $privateDirectory;
    private $dataDonnee;
    private $databaseService;

    public function __construct(EntityManagerInterface $entityManager, $privateDirectory,
                                DataDonnee $dataDonnee, DatabaseService $databaseService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->privateDirectory = $privateDirectory;
        $this->dataDonnee = $dataDonnee;
        $this->databaseService = $databaseService;
    }


    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

//        $io->title('Reset des tables');
//        $this->databaseService->resetTable($io, [DoQuartier::class]);

        $quartiers = $this->em->getRepository(DoQuartier::class)->findBy(['isNative' => true]);
        if(count($quartiers) > 1){
            $io->text("Quartier déjà initialisé.");
            return Command::FAILURE;
        }

        $importFile = $this->getPrivateDirectory() . "import/quartiers-marseille.geojson";
        if(!file_exists($importFile)){
            $io->text("Fichier introuvable.");
            return Command::FAILURE;
        }

        $content = file_get_contents($importFile);
        $content = json_decode($content);

        $progressBar = new ProgressBar($output, count($content->features));
        $progressBar->start();

        foreach($content->features as $item){

            $zipcode = $this->setRightZipcode($item->properties->DEPCO);
            $city    = $this->setRightCity($item->properties->NOM_CO);

            $data = [
                "name" => $item->properties->NOM_QUA,
                "zipcode" => $zipcode,
                "city" => $city,
                "polygon" => []
            ];

            $data = json_decode(json_encode($data));

            $obj = $this->dataDonnee->setDataQuartier(new DoQuartier(), $data);
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

    private function setRightZipcode($zipcode): string
    {
        $values = ["13201", "13202", "13203", "13204", "13205", "13206", "13207", "13208", "13209", "13210", "13211", "13212", "13213", "13214", "13215", "13216"];
        $reals  = ["13001", "13002", "13003", "13004", "13005", "13006", "13007", "13008", "13009", "13010", "13011", "13012", "13013", "13014", "13015", "13016"];

        if(in_array($zipcode, $values)){
            $position = array_search($zipcode, $values);
            return $reals[$position];
        }

        return $zipcode;
    }

    private function setRightCity($city): string
    {
        $values = [];
        $reals = [];

        for($i = 1 ; $i <= 16 ; $i++){
            $values[] = "Marseille " . $i . ($i === 1 ? "er" : "e") . " Arrondissemen";
            $reals[] = "MARSEILLE " . ($i <= 9 ? "0" : "") . $i;
        }

        if(in_array($city, $values)){
            $position = array_search($city, $values);
            return $reals[$position];
        }

        return $city;
    }

    public function getPrivateDirectory()
    {
        return $this->privateDirectory;
    }
}

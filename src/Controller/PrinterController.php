<?php

namespace App\Controller;

use App\Entity\History\HiPrice;
use App\Entity\History\HiPublish;
use App\Entity\History\HiVisite;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImOwner;
use App\Entity\User;
use App\Repository\Immo\ImBienRepository;
use App\Repository\Immo\ImPhotoRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre/impression", name="user_printer_")
 */
class PrinterController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @Route("/affiche/bien/{slug}", options={"expose"=true}, name="bien_display")
     */
    public function bien(Request $request, ImBien $obj, ImPhotoRepository $photoRepository, SerializerInterface $serializer): Response
    {
        $ori = $request->query->get('ori');
        $photos = $photoRepository->findBy(['bien' => $obj], ['rank' => 'ASC'], 4);

        $obj    = $serializer->serialize([$obj], 'json', ['groups' => User::USER_READ]);
        $photos = $serializer->serialize($photos, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/bien.html.twig', [
            'donnees' => $obj,
            'photos' => $photos,
            'ori' => $ori ?: "landscape"
        ]);
    }

    /**
     * @Route("/affiche/biens", options={"expose"=true}, name="biens_display")
     */
    public function biens(Request $request, ImBienRepository $bienRepository, ImPhotoRepository $photoRepository,
                          SerializerInterface $serializer): Response
    {
        $ori = $request->query->get('ori');

        /** @var User $user */
        $user = $this->getUser();

        $biens = $bienRepository->findBy(['agency' => $user->getAgency(), 'status' => ImBien::STATUS_ACTIF]);
        $photos = $photoRepository->findBy(['bien' => $biens], ['rank' => 'ASC'], 4);

        $biens    = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);
        $photos = $serializer->serialize($photos, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/bien.html.twig', [
            'donnees' => $biens,
            'photos' => $photos,
            'ori' => $ori ?: "landscape"
        ]);
    }

    /**
     * @Route("/rapport/bien/{slug}", options={"expose"=true}, name="bien_rapport")
     */
    public function rapportBien(ImBien $obj, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $data = $this->getDataHistoryBien($em, $serializer, $obj);

        $obj = $serializer->serialize($obj, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/rapport_bien.html.twig', array_merge([
            'donnees' => $obj,
        ], $data));
    }

    /**
     * @Route("/rapport/proprietaire/{id}", options={"expose"=true}, name="owner_rapport")
     */
    public function rapportOwner(ImOwner $obj, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $biens = $em->getRepository(ImBien::class)->findBy(['owner' => $obj, 'status' => ImBien::STATUS_ACTIF]);
        $data  = $this->getDataHistoryBien($em, $serializer, $biens);

        $obj        = $serializer->serialize($obj,       'json', ['groups' => User::ADMIN_READ]);
        $biens      = $serializer->serialize($biens,     'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/rapport_owner.html.twig', array_merge([
            'donnees' => $obj,
            'biens' => $biens,
        ], $data));
    }

    private function getDataHistoryBien($em, $serializer, $biens): array
    {
        $publishes = $em->getRepository(HiPublish::class)->findBy(['bienId' => $biens], ['createdAt' => 'DESC']);
        $visites   = $em->getRepository(HiVisite::class)->findBy(['bienId' => $biens], ['createdAt' => 'DESC']);
        $prices    = $em->getRepository(HiPrice::class)->findBy(['bienId' => $biens], ['createdAt' => 'DESC']);

        $publishes  = $serializer->serialize($publishes, 'json', ['groups' => HiPublish::HISTORY_PUBLISH]);
        $visites    = $serializer->serialize($visites,   'json', ['groups' => HiVisite::HISTORY_VISITE]);
        $prices     = $serializer->serialize($prices,    'json', ['groups' => HiPrice::HISTORY_PRICE]);

        return [
            'publishes' => $publishes,
            'visites' => $visites,
            'prices' => $prices
        ];
    }
}

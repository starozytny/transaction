<?php

namespace App\Controller;

use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImOwner;
use App\Entity\User;
use App\Repository\Immo\ImPhotoRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
     * @Route("/bien/{slug}", options={"expose"=true}, name="bien")
     */
    public function bien(ImBien $obj, ImPhotoRepository $photoRepository, SerializerInterface $serializer): Response
    {
        $photos = $photoRepository->findBy(['bien' => $obj], ['rank' => 'ASC'], 4);

        $obj    = $serializer->serialize($obj, 'json', ['groups' => User::USER_READ]);
        $photos = $serializer->serialize($photos, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/bien.html.twig', [
            'donnees' => $obj,
            'photos' => $photos,
        ]);
    }

    /**
     * @Route("/proprietaire/{id}", options={"expose"=true}, name="owner")
     */
    public function owner(ImOwner $obj, SerializerInterface $serializer): Response
    {
        $obj = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/impressions/owner.html.twig', [
            'donnees' => $obj
        ]);
    }
}
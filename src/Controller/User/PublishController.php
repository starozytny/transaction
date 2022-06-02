<?php

namespace App\Controller\User;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImPublish;
use App\Transaction\Entity\Immo\ImStat;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre/publications", name="user_publications_")
 */
class PublishController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @Route("/", name="index")
     */
    public function publications(SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $data = $em->getRepository(ImBien::class)->findBy([
            'agency' => $user->getAgencyId(), 'status' => ImBien::STATUS_ACTIF, 'isDraft' => false, 'isArchived' => false
        ]);
        $publishes = $em->getRepository(ImPublish::class)->findBy(['bien' => $data]);

        $data = $serializer->serialize($data, 'json', ['groups' => User::USER_READ]);
        $publishes = $serializer->serialize($publishes, 'json', ['groups' => ImPublish::PUBLISH_READ]);

        return $this->render('user/pages/publications/index.html.twig', [
            'donnees' => $data,
            'publishes' => $publishes,
        ]);
    }

    /**
     * @Route("/historique", name="histories")
     */
    public function publicationsHistories(SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $stats = $em->getRepository(ImStat::class)->findBy(['agency' => $user->getAgencyId()], ['createdAt' => 'DESC']);

        $stats = $serializer->serialize($stats, 'json', ['groups' => ImStat::STAT_READ]);

        return $this->render('user/pages/publications/history.html.twig', [
            'donnees' => $stats,
        ]);
    }
}

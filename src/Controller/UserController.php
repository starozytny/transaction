<?php

namespace App\Controller;

use App\Entity\Changelog;
use App\Entity\Mail;
use App\Entity\User;
use App\Service\MailerService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre", name="user_")
 */
class UserController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        $em = $this->doctrine->getManager();

        $changelogs = $em->getRepository(Changelog::class)->findBy(['isPublished' => true], ['createdAt' => 'DESC'], 5);

        return $this->render('user/pages/index.html.twig', [
            'changelogs' => $changelogs
        ]);
    }

    /**
     * @Route("/profil", options={"expose"=true}, name="profil")
     */
    public function profil(): Response
    {
        /** @var User $obj */
        $obj = $this->getUser();

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj
        ]);
    }

    /**
     * @Route("/modifier-profil", name="profil_update")
     */
    public function profilUpdate(SerializerInterface $serializer): Response
    {
        /** @var User $data */
        $data = $this->getUser();
        $data = $serializer->serialize($data, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('user/pages/profil/update.html.twig',  ['donnees' => $data]);
    }

    /**
     * @Route("/boite-mails", name="mails")
     */
    public function mails(MailerService $mailerService): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = $mailerService->getAllMailsData($user);

        return $this->render('user/pages/mails/index.html.twig', $data);
    }

    /**
     * @Route("/boite-mails/document/{filename}", options={"expose"=true}, name="mails_attachement")
     */
    public function mailsAttachement($filename): BinaryFileResponse
    {
        return new BinaryFileResponse($this->getParameter('private_directory') . Mail::FOLDER_FILES . "/" . $filename);
    }
}

<?php

namespace App\Controller\User;

use App\Repository\UserRepository;
use App\Entity\Mail;
use App\Entity\User;
use App\Service\MailerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre/boite-mails", name="user_mails_")
 */
class MailsController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function index(MailerService $mailerService): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = $mailerService->getAllMailsData($user);

        return $this->render('user/pages/mails/index.html.twig', $data);
    }

    /**
     * @Route("/document/{filename}", options={"expose"=true}, name="attachement")
     */
    public function attachement($filename): BinaryFileResponse
    {
        return new BinaryFileResponse($this->getParameter('private_directory') . Mail::FOLDER_FILES . "/" . $filename);
    }

    /**
     * @Route("/reception/envoyer", options={"expose"=true}, name="send")
     */
    public function send(Request $request, UserRepository $userRepository, SerializerInterface $serializer): Response
    {
        $dest = $request->query->get('dest');

        /** @var User $user */
        $user = $this->getUser();
        $users = $userRepository->findBy(['agency' => $user->getAgencyId()]);

        $users = $serializer->serialize($users, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/mails/send.html.twig', [
            'users' => $users,
            'dest' => $dest
        ]);
    }
}

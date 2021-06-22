<?php

namespace App\Controller;

use App\Entity\Settings;
use App\Entity\User;
use App\Service\Data\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/admin", name="admin_")
 */
class AdminController extends AbstractController
{
    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        $em = $this->getDoctrine()->getManager();
        $users = $em->getRepository(User::class)->findAll();
        $settings = $em->getRepository(Settings::class)->findAll();

        $totalUsers = count($users); $nbConnected = 0;
        foreach($users as $user){
            if($user->getLastLogin()){
                $nbConnected++;
            }
        }
        return $this->render('admin/pages/index.html.twig', [
            'settings' => $settings ? $settings[0] : null,
            'totalUsers' => $totalUsers,
            'nbConnected' => $nbConnected,
        ]);
    }

    /**
     * @Route("/styleguide/html", name="styleguide_html")
     */
    public function styleguideHtml(): Response
    {
        return $this->render('admin/pages/styleguide/index.html.twig');
    }

    /**
     * @Route("/styleguide/react", options={"expose"=true}, name="styleguide_react")
     */
    public function styleguideReact(Request  $request): Response
    {
        if($request->isMethod("POST")){
            return new JsonResponse(['code' => true]);
        }
        return $this->render('admin/pages/styleguide/react.html.twig');
    }

    /**
     * @Route("/utilisateurs", name="users_index")
     */
    public function users(UserService $userService, SerializerInterface $serializer): Response
    {
        $objs = $userService->getList('ASC');
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('admin/pages/user/index.html.twig', [
            'users' => $objs
        ]);
    }

    /**
     * @Route("/parametres", name="settings_index")
     */
    public function settings(): Response
    {
        return $this->render('admin/pages/settings/index.html.twig');
    }

    /**
     * @Route("/contact", name="contact_index")
     */
    public function contact(): Response
    {
        return $this->render('admin/pages/contact/index.html.twig');
    }
}

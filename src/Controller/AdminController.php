<?php

namespace App\Controller;

use App\Entity\Changelog;
use App\Entity\Contact;
use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImBuyer;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOwner;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImSearch;
use App\Entity\Immo\ImSuivi;
use App\Entity\Immo\ImTenant;
use App\Entity\Notification;
use App\Entity\Settings;
use App\Entity\Society;
use App\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
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
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }
    
    private function getAllData($classe, SerializerInterface $serializer, $groups = User::ADMIN_READ): string
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository($classe)->findAll();

        return $serializer->serialize($objs, 'json', ['groups' => $groups]);
    }

    private function getRenderView(Request $request, SerializerInterface $serializer, $class, $route): Response
    {
        $objs = $this->getAllData($class, $serializer);
        $search = $request->query->get('search');
        if($search){
            return $this->render($route, [
                'donnees' => $objs,
                'search' => $search
            ]);
        }

        return $this->render($route, [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        $em = $this->doctrine->getManager();
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
    public function users(Request $request, SerializerInterface $serializer): Response
    {
        $route = 'admin/pages/user/index.html.twig';
        $objs = $this->getAllData(User::class, $serializer);
        $societies = $this->getAllData(Society::class, $serializer);
        $agencies = $this->getAllData(ImAgency::class, $serializer);
        $negotiators = $this->getAllData(ImNegotiator::class, $serializer);

        $params = [
            'donnees' => $objs,
            'societies' => $societies,
            'agencies' => $agencies,
            'negotiators' => $negotiators
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
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
    public function contact(Request $request, SerializerInterface $serializer): Response
    {
        return $this->getRenderView($request, $serializer, Contact::class, 'admin/pages/contact/index.html.twig');
    }

    /**
     * @Route("/notifications", options={"expose"=true}, name="notifications_index")
     */
    public function notifications(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(Notification::class, $serializer);

        return $this->render('admin/pages/notifications/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/changelogs", options={"expose"=true}, name="changelogs_index")
     */
    public function changelogs(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(Changelog::class, $serializer, User::USER_READ);

        return $this->render('admin/pages/changelog/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/boite-reception/envoyer", options={"expose"=true}, name="mails_send")
     */
    public function mailsSend(Request $request, SerializerInterface $serializer): Response
    {
        $dest = $request->query->get('dest');
        $users = $this->getAllData(User::class, $serializer);

        return $this->render('admin/pages/mails/send.html.twig', [
            'users' => $users,
            'dest' => $dest
        ]);
    }

    /**
     * @Route("/societes", name="societies_index")
     */
    public function societies(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(Society::class, $serializer);
        $users= $this->getAllData(User::class, $serializer, Society::COUNT_READ);

        return $this->render('admin/pages/society/index.html.twig', [
            'donnees' => $objs,
            'users' => $users
        ]);
    }

    /**
     * @Route("/immobilier/agences", name="agencies_index")
     */
    public function agencies(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $objs = $this->getAllData(ImAgency::class, $serializer);
        $biens = $em->getRepository(ImBien::class)->findAll();
        $societies = $this->getAllData(Society::class, $serializer);

        $biens = $serializer->serialize($biens, 'json', ['groups' => ImBien::COUNT_BY_AGENCY]);

        return $this->render('admin/pages/immo/agencies.html.twig', [
            'donnees' => $objs,
            'societies' => $societies,
            'biens' => $biens,
        ]);
    }

    /**
     * @Route("/immobilier/negociateurs", name="negotiators_index")
     */
    public function negotiators(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(ImNegotiator::class, $serializer);
        $agencies = $this->getAllData(ImAgency::class, $serializer);
        $biens = $this->getAllData(ImBien::class, $serializer, User::USER_READ);

        return $this->render('admin/pages/immo/negotiators.html.twig', [
            'donnees' => $objs,
            'agencies' => $agencies,
            'biens' => $biens,
        ]);
    }

    /**
     * @Route("/immobilier/proprietaires", name="owners_index")
     */
    public function owners(Request $request, SerializerInterface $serializer): Response
    {
        $route = 'admin/pages/immo/owners.html.twig';

        $objs        = $this->getAllData(ImOwner::class, $serializer, ImOwner::OWNER_READ);
        $societies   = $this->getAllData(Society::class, $serializer, ImOwner::OWNER_READ);
        $agencies    = $this->getAllData(ImAgency::class, $serializer, ImOwner::OWNER_READ);
        $negotiators = $this->getAllData(ImNegotiator::class, $serializer, ImOwner::OWNER_READ);
        $biens       = $this->getAllData(ImBien::class, $serializer, User::USER_READ);

        $params = [
            'donnees' => $objs,
            'societies' => $societies,
            'agencies' => $agencies,
            'negotiators' => $negotiators,
            'biens' => $biens,
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
    }

    /**
     * @Route("/immobilier/locataires", name="tenants_index")
     */
    public function tenants(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(ImTenant::class, $serializer);
        $societies = $this->getAllData(Society::class, $serializer);
        $agencies = $this->getAllData(ImAgency::class, $serializer);
        $negotiators = $this->getAllData(ImNegotiator::class, $serializer);

        return $this->render('admin/pages/immo/tenants.html.twig', [
            'donnees' => $objs,
            'societies' => $societies,
            'agencies' => $agencies,
            'negotiators' => $negotiators,
        ]);
    }

    /**
     * @Route("/immobilier/prospects", options={"expose"=true}, name="prospects_index")
     */
    public function prospects(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(ImProspect::class, $serializer);
        $societies = $this->getAllData(Society::class, $serializer);
        $agencies = $this->getAllData(ImAgency::class, $serializer);
        $negotiators = $this->getAllData(ImNegotiator::class, $serializer);

        return $this->render('admin/pages/immo/prospects.html.twig', [
            'donnees' => $objs,
            'societies' => $societies,
            'agencies' => $agencies,
            'negotiators' => $negotiators,
        ]);
    }

    /**
     * @Route("/immobilier/acquereurs", name="buyers_index")
     */
    public function buyers(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(ImBuyer::class, $serializer);
        $societies = $this->getAllData(Society::class, $serializer);
        $agencies = $this->getAllData(ImAgency::class, $serializer);
        $negotiators = $this->getAllData(ImNegotiator::class, $serializer);

        return $this->render('admin/pages/immo/buyers.html.twig', [
            'donnees' => $objs,
            'societies' => $societies,
            'agencies' => $agencies,
            'negotiators' => $negotiators,
        ]);
    }
}

<?php

namespace App\Controller\User;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Agenda\AgEvent;
use App\Transaction\Entity\Immo\ImContractant;
use App\Transaction\Entity\Immo\ImOwner;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImTenant;
use App\Transaction\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Service\Agenda\EventService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre", name="user_")
 */
class TransactionController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @Route("/negociateurs", name="negotiators")
     */
    public function negotiators(Request $request, SerializerInterface $serializer): Response
    {
        $route = 'user/pages/negotiators/index.html.twig';

        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $agencies = $em->getRepository(ImAgency::class)->findBy(['societyId' => $user->getSociety()->getId()]);
        $objs = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $agencies]);
        $biens = $em->getRepository(ImBien::class)->findBy(['negotiator' => $objs, 'status' => ImBien::STATUS_ACTIF]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $biens = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);

        $params = [
            'data' => $objs,
            'user' => $user,
            'biens' => $biens,
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
    }

    /**
     * @Route("/proprietaires", name="owners")
     */
    public function owners(Request $request, SerializerInterface $serializer): Response
    {
        $route = 'user/pages/owners/index.html.twig';

        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $objs = $em->getRepository(ImOwner::class)->findBy(['agency' => $user->getAgencyId()]);
        $contractants = $em->getRepository(ImContractant::class)->findBy(['owner' => $objs]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgencyId()]);

        $biens = [];
        foreach($contractants as $contractant) {
            $biens[] = [
                'ownerId' => $contractant->getOwner()->getId(),
                'bien' => $contractant->getContract()->getBien()
            ];
        }

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);
        $biens = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);

        $params = [
            'data' => $objs,
            'user' => $user,
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
     * @Route("/prospects-{type}", options={"expose"=true}, name="prospects")
     */
    public function prospects(Request $request, $type, SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $getArchived = (bool)$request->query->get('ar');

        $objs = $em->getRepository(ImProspect::class)->findBy(['agency' => $user->getAgencyId(), 'isArchived' => $getArchived]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgencyId()]);

        $data = [];
        foreach($objs as $obj){
            switch ($type){
                case "locataires":
                    if($obj->getType() != ImProspect::TYPE_VENTE && $obj->getType() != ImProspect::TYPE_INVEST){
                        $data[] = $obj;
                    }
                    break;
                case "acquereurs":
                    if($obj->getType() != ImProspect::TYPE_LOCATION){
                        $data[] = $obj;
                    }
                    break;
                default:
                    break;
            }
        }

        $objs = $serializer->serialize($data, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        $route = "user/pages/prospects/" . ($getArchived ? "archived" : "index") . ".html.twig";
        $params = [
            'type' => $type,
            'data' => $objs,
            'user' => $user,
            'negotiators' => $negotiators
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
    }

    /**
     * @Route("/locataires", name="tenants")
     */
    public function tenants(Request $request, SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $getArchived = (bool)$request->query->get('ar');

        $objs = $em->getRepository(ImTenant::class)->findBy(['agency' => $user->getAgencyId(), 'isArchived' => $getArchived]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgencyId()]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        $route = "user/pages/tenants/" . ($getArchived ? "archived" : "index") . ".html.twig";
        $params = [
            'data' => $objs,
            'user' => $user,
            'negotiators' => $negotiators
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
    }

    /**
     * @Route("/agenda", options={"expose"=true}, name="agenda")
     */
    public function agenda(Request $request, SerializerInterface $serializer, EventService $eventService): Response
    {
        $route = 'user/pages/agenda/index.html.twig';

        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $objs = $em->getRepository(AgEvent::class)->findAll();
        $data = $eventService->getEvents($objs, $user);
        $objs = $serializer->serialize($data, 'json', ['groups' => User::AGENDA_READ]);

        $params = ['donnees' => $objs];

        $ty = $request->query->get('ty');
        $search = $request->query->get('se');
        if($search && $ty){
            return $this->render($route, array_merge($params, ['type' => $ty, 'search' => $search]));
        }

        return $this->render($route, $params);
    }

    /**
     * @Route("/visites", options={"expose"=true}, name="visites")
     */
    public function visits(SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $biens   = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgencyId()]);
        $objs    = $em->getRepository(ImVisit::class)->findBy(['bien' => $biens]);

        $objs    = $serializer->serialize($objs, 'json', ['groups' => ImVisit::VISIT_READ]);

        return $this->render('user/pages/visits/index.html.twig', [
            'donnees' => $objs,
        ]);
    }
}

<?php

namespace App\Controller\Api\Agenda;

use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOwner;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImTenant;
use App\Entity\User;
use App\Service\ApiResponse;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/agenda/", name="api_agenda_")
 */
class AgendaController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Get data persons
     *
     * @Route("/data/persons", name="data_persons", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Agenda")
     *
     * @param ApiResponse $apiResponse
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function persons(ApiResponse $apiResponse, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();

        $allUsers = $em->getRepository(User::class)->findAll();
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);
        $owners = $em->getRepository(ImOwner::class)->findBy(['agency' => $user->getAgency()]);
        $tenants = $em->getRepository(ImTenant::class)->findBy(['agency' => $user->getAgency()]);
        $prospects = $em->getRepository(ImProspect::class)->findBy(['agency' => $user->getAgency()]);

        $users = []; $managers = [];
        foreach($allUsers as $user){
            if($user->getHighRoleCode() === User::CODE_ROLE_USER){
                $users[] = $user;
            }elseif ($user->getHighRoleCode() === User::CODE_ROLE_MANAGER){
                $managers[] = $user;
            }
        }

        $users = $serializer->serialize($users, 'json', ['groups' => User::AGENDA_READ]);

        $managers = $serializer->serialize($managers, 'json', ['groups' => User::AGENDA_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::AGENDA_READ]);
        $owners = $serializer->serialize($owners, 'json', ['groups' => User::AGENDA_READ]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => User::AGENDA_READ]);
        $prospects = $serializer->serialize($prospects, 'json', ['groups' => User::AGENDA_READ]);

        return $apiResponse->apiJsonResponse([
            "users" => $users,
            "managers" => $managers,
            "negotiators" => $negotiators,
            "owners" => $owners,
            "tenants" => $tenants,
            "prospects" => $prospects
        ]);
    }
}

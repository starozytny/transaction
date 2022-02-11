<?php

namespace App\Controller\Api\Agenda;

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

        $allUsers = $em->getRepository(User::class)->findAll();

        $users = [];
        foreach($allUsers as $user){
            if($user->getHighRoleCode() === User::CODE_ROLE_USER
                || $user->getHighRoleCode() === User::CODE_ROLE_DEVELOPER
                || $user->getHighRoleCode() === User::CODE_ROLE_ADMIN
            ){
                $users[] = $user;
            }
        }

        $users = $serializer->serialize($users, 'json', ['groups' => User::AGENDA_READ]);

        return $apiResponse->apiJsonResponse([
            "users" => $users
        ]);
    }
}

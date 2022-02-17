<?php

namespace App\Controller\Api\Donnee;

use App\Entity\Donnee\DoSol;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use App\Service\Data\Donnee\DataDonnee;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/donnees/sols", name="api_donnees_sols_")
 */
class SolController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, DoSol $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataDonnee $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataSol($obj, $data);

        /** @var User $user */
        $user = $this->getUser();
        $obj->setAgency($user->getAgency());

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::DONNEE_READ);
    }

    /**
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Donnees")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataDonnee $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataDonnee $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new DoSol(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Donnees")
     *
     * @param DoSol $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataDonnee $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update(DoSol $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataDonnee $dataEntity): JsonResponse
    {
        if($obj->getIsNative()){
            return $apiResponse->apiJsonResponseBadRequest("Vous ne pouvez pas modifier cette donnée.");
        }

        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Donnees")
     *
     * @param DoSol $obj
     * @param ApiResponse $apiResponse
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(DoSol $obj, ApiResponse $apiResponse, DataService $dataService): JsonResponse
    {
        if($obj->getIsNative()){
            return $apiResponse->apiJsonResponseBadRequest("Vous ne pouvez pas modifier cette donnée.");
        }

        return $dataService->delete($obj);
    }
}

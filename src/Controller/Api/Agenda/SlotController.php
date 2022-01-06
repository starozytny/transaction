<?php

namespace App\Controller\Api\Agenda;

use App\Entity\Agenda\AgSlot;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Agenda\DataSlot;
use App\Service\Data\DataService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/agenda/slots", name="api_agenda_slots_")
 */
class SlotController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, AgSlot $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataSlot $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataSlot($obj, $data);

        if($type == "create"){
            /** @var User $user */
            $user = $this->getUser();
            $obj->setCreator($user);
        }else{
            $obj->setUpdatedAt(new \DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::USER_READ);
    }

    /**
     * Create a slot
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Agenda")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataSlot $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataSlot $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new AgSlot(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update a slot
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Agenda")
     *
     * @param AgSlot $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataSlot $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update(AgSlot $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataSlot $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Delete a slot
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Agenda")
     *
     * @param AgSlot $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(AgSlot $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }
}

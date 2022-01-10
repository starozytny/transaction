<?php

namespace App\Controller\Api\Agenda;

use App\Entity\Agenda\AgEvent;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Agenda\DataEvent;
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
 * @Route("/api/agenda/events", name="api_agenda_events_")
 */
class EventController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, AgEvent $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataEvent $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataEvent($obj, $data);

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

        return $apiResponse->apiJsonResponse($obj, User::AGENDA_READ);
    }

    /**
     * Create an event
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
     * @param DataEvent $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataEvent $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new AgEvent(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update an event
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
     * @param AgEvent $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataEvent $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update(AgEvent $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataEvent $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update an event date
     *
     * @Route("/update-date/{id}", name="update_date", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Agenda")
     *
     * @param AgEvent $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataEvent $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function updateDate(AgEvent $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataEvent $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataEventDate($obj, $data);
        $obj->setUpdatedAt(new \DateTime());

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::AGENDA_READ);
    }

    /**
     * Delete an event
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
     * @param AgEvent $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(AgEvent $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }
}

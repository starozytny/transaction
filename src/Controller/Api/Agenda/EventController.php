<?php

namespace App\Controller\Api\Agenda;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Agenda\AgEvent;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Agenda\DataEvent;
use App\Service\Data\DataService;
use App\Service\History\HistoryService;
use App\Service\ValidatorService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/agenda/events", name="api_agenda_events_")
 */
class EventController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, AgEvent $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataEvent $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataEvent($obj, $data);
        $obj = $dataEntity->setCreatorAndUpdate($type, $obj, $user);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        $data = $serializer->serialize($obj, "json", ['groups' => User::AGENDA_READ]);

        $data = json_decode($data);
        $data->persons = $obj->getPersons();

        return $apiResponse->apiJsonResponseCustom($data);
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
     * @param SerializerInterface $serializer
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataEvent $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        return $this->submitForm("create", new AgEvent(), $request, $apiResponse, $validator, $dataEntity, $serializer);
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
     * @param SerializerInterface $serializer
     * @return JsonResponse
     * @throws Exception
     */
    public function update(AgEvent $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataEvent $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity, $serializer);
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
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

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
     * @param HistoryService $historyService
     * @return JsonResponse
     */
    public function delete(AgEvent $obj, DataService $dataService, HistoryService $historyService): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        if($visit = $obj->getImVisit()){
            $historyService->createVisit(AgEvent::STATUS_DELETE, $visit->getBien()->getId(), $visit->getId(), $obj);
            $em->remove($visit);
        }

        return $dataService->delete($obj);
    }
}

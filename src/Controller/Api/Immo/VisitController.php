<?php

namespace App\Controller\Api\Immo;

use App\Entity\Agenda\AgEvent;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Agenda\DataEvent;
use App\Service\Data\DataImmo;
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
 * @Route("/api/visits", name="api_visits_")
 */
class VisitController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImVisit $obj, AgEvent $event, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity, DataEvent $dataEvent): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        /** @var User $user */
        $user = $this->getUser();

        $bien = $em->getRepository(ImBien::class)->find($data->bien);
        if (!$bien){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue. Aucun bien lié à cette visite.');
        }

        $event = $dataEvent->setDataEvent($event, $data);
        $event = $dataEvent->setCreatorAndUpdate($type, $event, $user);
        $obj = $dataEntity->setDataVisit($obj, $event, $bien);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($event);
        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Create a visit
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Visits")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataEvent $dataEvent
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataEvent $dataEvent, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new ImVisit(), new AgEvent(), $request, $apiResponse, $validator, $dataEntity, $dataEvent);
    }

    /**
     * Update a visit
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Visits")
     *
     * @param ImVisit $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataImmo $dataEntity
     * @param DataEvent $dataEvent
     * @return JsonResponse
     * @throws Exception
     */
    public function update(ImVisit $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, DataEvent $dataEvent): JsonResponse
    {
        return $this->submitForm("update", $obj, $obj->getAgEvent(), $request, $apiResponse, $validator, $dataEntity, $dataEvent);
    }

    /**
     * Delete a visit
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Visits")
     *
     * @param ImVisit $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(ImVisit $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }
}

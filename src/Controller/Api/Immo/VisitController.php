<?php

namespace App\Controller\Api\Immo;

use App\Entity\Agenda\AgEvent;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Repository\Immo\ImVisitRepository;
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
use Symfony\Component\Serializer\SerializerInterface;

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
     * get visits of bien
     *
     * @Route("/bien/{id}", name="bien", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Visits")
     *
     * @param ImBien $obj
     * @param ImVisitRepository $repository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(ImBien $obj, ImVisitRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $objs = $repository->findBy(['bien' => $obj]);

        return $apiResponse->apiJsonResponse($objs, ImVisit::VISIT_READ);
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImVisit $obj, AgEvent $event, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity, DataEvent $dataEvent, SerializerInterface $serializer): JsonResponse
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

        $data = $serializer->serialize($obj, "json", ['groups' => ImVisit::VISIT_READ]);

        $data = json_decode($data);
        $data->agEvent->persons = $obj->getAgEvent()->getPersons();

        return $apiResponse->apiJsonResponseCustom($data);
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
     * @param SerializerInterface $serializer
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataEvent $dataEvent, DataImmo $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        return $this->submitForm("create", new ImVisit(), new AgEvent(), $request, $apiResponse, $validator, $dataEntity, $dataEvent, $serializer);
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
     * @param SerializerInterface $serializer
     * @return JsonResponse
     * @throws Exception
     */
    public function update(ImVisit $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, DataEvent $dataEvent, SerializerInterface $serializer): JsonResponse
    {
        return $this->submitForm("update", $obj, $obj->getAgEvent(), $request, $apiResponse, $validator, $dataEntity, $dataEvent, $serializer);
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

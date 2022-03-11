<?php

namespace App\Controller\Api\Immo;

use App\Entity\Agenda\AgEvent;
use App\Entity\History\HiVisite;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Repository\Immo\ImVisitRepository;
use App\Service\ApiResponse;
use App\Service\Data\Agenda\DataEvent;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\FileCreator;
use App\Service\History\HistoryService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Mpdf\MpdfException;
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
    public function submitForm($type, ImVisit $obj, AgEvent $event, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                               DataImmo $dataEntity, DataEvent $dataEvent, SerializerInterface $serializer, HistoryService $historyService): JsonResponse
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

        $existe = $em->getRepository(HiVisite::class)->findOneBy(['bienId' => $bien->getId(), 'visiteId' => $obj->getId()], ['createdAt' => 'DESC']);
        if($existe && $existe->getStatus() != $event->getStatus() || !$existe){
            $historyService->createVisit($event->getStatus(), $bien->getId(), $obj->getId(), $event, $data->prospects ?: []);
        }

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
     * @param HistoryService $historyService
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataEvent $dataEvent, DataImmo $dataEntity, SerializerInterface $serializer, HistoryService $historyService): JsonResponse
    {
        return $this->submitForm("create", new ImVisit(), new AgEvent(), $request, $apiResponse, $validator, $dataEntity, $dataEvent, $serializer, $historyService);
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
     * @param HistoryService $historyService
     * @return JsonResponse
     * @throws Exception
     */
    public function update(ImVisit $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, DataEvent $dataEvent, SerializerInterface $serializer, HistoryService $historyService): JsonResponse
    {
        return $this->submitForm("update", $obj, $obj->getAgEvent(), $request, $apiResponse, $validator, $dataEntity, $dataEvent, $serializer, $historyService);
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
     * @param HistoryService $historyService
     * @return JsonResponse
     */
    public function delete(ImVisit $obj, DataService $dataService, HistoryService $historyService): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $event = $obj->getAgEvent();
        $historyService->createVisit(AgEvent::STATUS_DELETE, $obj->getBien()->getId(), $obj->getId(), $event);
        $em->remove($event);

        return $dataService->delete($obj);
    }

    /**
     * Bon de visite
     *
     * @Route("/document/{from}/{id}", name="document_bon", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Visits")
     *
     * @param $from
     * @param $id
     * @param ApiResponse $apiResponse
     * @param FileCreator $fileCreator
     * @return JsonResponse
     * @throws MpdfException
     */
    public function documentBon($from, $id, ApiResponse $apiResponse, FileCreator $fileCreator): JsonResponse
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $agency = $user->getAgency();

        $obj = $em->getRepository($from == "prospect" ? ImProspect::class : ImVisit::class)->find($id);

        $img = file_get_contents(($agency->getLogo() ? $this->getParameter('public_directory') : "") . $agency->getLogoFile());
        $base64 = base64_encode($img);

        $params = ['agency' => $agency, 'logo' => $base64];

        if($id == "generique" || !$obj){
            $params = array_merge($params, []);
        }else{
            $params = array_merge($params, [
                'prospect' => $obj
            ]);
        }

        $fileCreator->createPDF("Bon de visite", "bon-visite", "user/pdf/visits/bon.html.twig", $params);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}

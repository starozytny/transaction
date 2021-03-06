<?php

namespace App\Controller\Api\Immo;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Agenda\AgEvent;
use App\Transaction\Entity\History\HiVisite;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Transaction\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Agenda\DataEvent;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\FileCreator;
use App\Service\History\HistoryService;
use App\Service\ValidatorService;
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
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
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
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(ImBien $obj, ApiResponse $apiResponse): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $objs = $em->getRepository(ImVisit::class)->findBy(['bien' => $obj]);

        return $apiResponse->apiJsonResponse($objs, ImVisit::VISIT_READ);
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImVisit $obj, AgEvent $event, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                               DataImmo $dataEntity, DataEvent $dataEvent, SerializerInterface $serializer, HistoryService $historyService): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les donn??es sont vides.');
        }

        /** @var User $user */
        $user = $this->getUser();

        $bien = $em->getRepository(ImBien::class)->find($data->bien);
        if (!$bien){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue. Aucun bien li?? ?? cette visite.');
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
            $historyService->createVisit($em, $event->getStatus(), $bien->getId(), $obj->getId(), $event, $data->prospects ?: []);
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
     * @param $id
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
    public function update($id, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, DataEvent $dataEvent, SerializerInterface $serializer, HistoryService $historyService): JsonResponse
    {
        $em = $this->immoService->getEntityUserManager($this->getUser());

        $obj = $em->getRepository(ImVisit::class)->find($id);
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
     * @param $id
     * @param DataService $dataService
     * @param HistoryService $historyService
     * @return JsonResponse
     */
    public function delete($id, DataService $dataService, HistoryService $historyService): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj = $em->getRepository(ImVisit::class)->find($id);

        $event = $obj->getAgEvent();
        $historyService->createVisit($em, AgEvent::STATUS_DELETE, $obj->getBien()->getId(), $obj->getId(), $event);
        $em->remove($event);

        return $dataService->deleteTransac($this->getUser(), $obj);
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
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $agency = $this->immoService->getUserAgency($user);

        $obj = $em->getRepository($from == "suivi" ? ImSuivi::class : ImVisit::class)->find($id);

        $img = file_get_contents(($agency->getLogo() ? $this->getParameter('public_directory') : "") . $agency->getLogoFile());
        $base64 = base64_encode($img);

        $params = ['agency' => $agency, 'logo' => $base64];

        $prospects = [];
        if($from == "visite" && $obj){
            $prospects = $obj->getAgEvent()->getPersons()['prospects'];
        }

        if($id == "generique" || !$obj){
            $params = array_merge($params, []);
        }else{
            $params = array_merge($params, [
                'prospect' => $from == "suivi" ? $obj->getProspect() : null,
                'prospects' => $from == "visite" ? $prospects : null,
                'biens' => [$obj->getBien()]
            ]);
        }

        $fileCreator->createPDF("Bon de visite", "bon-visite", "user/pdf/visits/bon.html.twig", $params);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}

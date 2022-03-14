<?php

namespace App\Controller\Api\Immo;

use App\Entity\Donnee\DoQuartier;
use App\Entity\Immo\ImAdvantage;
use App\Entity\Immo\ImAdvert;
use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImConfidential;
use App\Entity\Immo\ImDiag;
use App\Entity\Immo\ImFeature;
use App\Entity\Immo\ImFinancial;
use App\Entity\Immo\ImLocalisation;
use App\Entity\Immo\ImMandat;
use App\Entity\Immo\ImNumber;
use App\Entity\Immo\ImPhoto;
use App\Entity\Immo\ImPublish;
use App\Entity\Immo\ImSupport;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\Data\Donnee\DataDonnee;
use App\Service\FileUploader;
use App\Service\History\HistoryService;
use App\Service\Immo\ImmoService;
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
 * @Route("/api/biens", name="api_biens_")
 */
class BienController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function setProperty($em, $type, $obj, $data, ImAgency $agency, ApiResponse $apiResponse, ValidatorService $validator, DataImmo $dataEntity, ImmoService $immoService)
    {
        switch ($type){
            case "mandat":
                $obj = $dataEntity->setDataMandat($immoService, $obj, $data, $agency);
                break;
            case "advert":
                $obj = $dataEntity->setDataAdvert($obj, $data);
                break;
            case "confidential":
                $obj = $dataEntity->setDataConfidential($obj, $data);
                break;
            case "financial":
                $obj = $dataEntity->setDataFinancial($obj, $data);
                break;
            case "localisation":
                $obj = $dataEntity->setDataLocalisation($obj, $data);
                break;
            case "diag":
                $obj = $dataEntity->setDataDiag($obj, $data);
                break;
            case "advantage":
                $obj = $dataEntity->setDataAdvantage($obj, $data);
                break;
            case "feature":
                $obj = $dataEntity->setDataFeature($obj, $data);
                break;
            case "number":
                $obj = $dataEntity->setDataNumber($obj, $data);
                break;
            default:
                $obj = $dataEntity->setDataArea($obj, $data);
                break;
        }

        if(!is_object($obj)){
            return $apiResponse->apiJsonResponseValidationFailed($obj);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);

        return $obj;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImBien $obj, Request $request, ApiResponse $apiResponse, FileUploader $fileUploader,
                               ValidatorService $validator, DataImmo $dataEntity, DataDonnee $dataDonnee, $immoService,
                               HistoryService $historyService, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $old = clone $obj;
        $old = $serializer->serialize($old, 'json', ['groups' => User::USER_READ]);
        $old = json_decode($old, true);
        dump($old);

        /** @var User $user */
        $user = $this->getUser();
        $agency = $user->getAgency();

        if($type === "create" && $data->id){
            $obj = $em->getRepository(ImBien::class)->find($data->id);
            if(!$obj){
                return $apiResponse->apiJsonResponseBadRequest('Le bien est introuvable, veuillez contacter le support pour résoudre cette erreur.');
            }
        }

        $tab = [
            [ "type" => "area",         "new" => new ImArea(),          "existe" => $obj->getArea() ],
            [ "type" => "number",       "new" => new ImNumber(),        "existe" => $obj->getNumber() ],
            [ "type" => "feature",      "new" => new ImFeature(),       "existe" => $obj->getFeature() ],
            [ "type" => "advantage",    "new" => new ImAdvantage(),     "existe" => $obj->getAdvantage() ],
            [ "type" => "diag",         "new" => new ImDiag(),          "existe" => $obj->getDiag() ],
            [ "type" => "localisation", "new" => new ImLocalisation(),  "existe" => $obj->getLocalisation() ],
            [ "type" => "financial",    "new" => new ImFinancial(),     "existe" => $obj->getFinancial() ],
            [ "type" => "confidential", "new" => new ImConfidential(),  "existe" => $obj->getConfidential() ],
            [ "type" => "advert",       "new" => new ImAdvert(),        "existe" => $obj->getAdvert() ],
            [ "type" => "mandat",       "new" => new ImMandat(),        "existe" => $obj->getMandat() ],
        ];

        $area = null; $number = null; $feature = null; $advantage = null; $diag = null; $localisation = null;
        $financial = null; $confidential = null; $advert = null; $mandat = null;
        foreach($tab as $item){
            $donnee = $this->setProperty($em, $item["type"], $type == "create" ? $item["new"] : $item["existe"],
                $data, $agency, $apiResponse, $validator, $dataEntity, $immoService);
            switch ($item["type"]){
                case "mandat":
                    if(!$donnee instanceof ImMandat){ return $donnee; }
                    $mandat = $donnee;
                    break;
                case "advert":
                    if(!$donnee instanceof ImAdvert){ return $donnee; }
                    $advert = $donnee;
                    break;
                case "confidential":
                    if(!$donnee instanceof ImConfidential){ return $donnee; }
                    $confidential = $donnee;
                    break;
                case "financial":
                    if(!$donnee instanceof ImFinancial){ return $donnee; }
                    $financial = $donnee;
                    break;
                case "localisation":
                    if(!$donnee instanceof ImLocalisation){ return $donnee; }
                    $localisation = $donnee;
                    break;
                case "diag":
                    if(!$donnee instanceof ImDiag){ return $donnee; }
                    $diag = $donnee;
                    break;
                case "advantage":
                    if(!$donnee instanceof ImAdvantage){ return $donnee; }
                    $advantage = $donnee;
                    break;
                case "feature":
                    if(!$donnee instanceof ImFeature){ return $donnee; }
                    $feature = $donnee;
                    break;
                case "number":
                    if(!$donnee instanceof ImNumber){ return $donnee; }
                    $number = $donnee;
                    break;
                default:
                    if(!$donnee instanceof ImArea){ return $donnee; }
                    $area = $donnee;
                    break;
            }
        }

        $rooms = (int) $data->caseTypeBien == 1 ? $dataEntity->setDataRooms($data, $type == "create" ? [] : $obj->getRooms()) : [];

        $obj = $dataEntity->setDataBien($agency, $obj, $data, $area, $number, $feature, $advantage, $diag,
            $localisation, $financial, $confidential, $advert, $mandat, $rooms);
        if(!$obj instanceof ImBien){
            return $apiResponse->apiJsonResponseValidationFailed($obj);
        }

        $files = $request->files->get('photos');
        $oriPhotos = $obj->getPhotos();
        $folderPhoto = ImBien::FOLDER_PHOTOS . "/" . $agency->getDirname();

        if($type == "create"){
            $obj = ($obj)
                ->setUser($user)
                ->setReference($immoService->getReference($agency, (int) $data->codeTypeAd))
                ->setCreatedBy($user->getShortFullName())
                ->setIdentifiant(mb_strtoupper(uniqid().bin2hex(random_bytes(8))))
                ->setAgency($agency)
            ;
        }else{
            $obj = ($obj)
                ->setUpdatedAt(new \DateTime())
                ->setUpdatedBy($user->getShortFullName())
            ;

            $this->updateRemovePhotos($em, $fileUploader, $dataEntity, $folderPhoto, $oriPhotos, $data->photos);
        }

        $obj = $this->addPhotos($em, $fileUploader, $folderPhoto, $dataEntity, $user, $obj, $files, $data->photos);
        $obj = $this->addSupports($em, $obj, $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        $historyService->createPrice($obj);
        if($type == "update"){
            $historyService->createBien($serializer, $old, $obj, $user);
        }

        if($data->newQuartier && $data->newQuartier[0] == 1){
            $quartier = $dataDonnee->setDataQuartier(new DoQuartier(), $data, $data->quartier);

            /** @var User $user */
            $user = $this->getUser();
            $quartier->setAgency($user->getAgency());

            $em->persist($quartier);
        }

        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::USER_READ);
    }

    private function addSupports($em, ImBien $obj, $data): ImBien
    {
        $existes = []; $supports = [];
        $publishes = $em->getRepository(ImPublish::class)->findBy(['bien' => $obj]);

        /** @var ImPublish $publish */
        foreach($publishes as $publish){
            $find = false;
            foreach($data->supports as $support){
                if($support == $publish->getSupport()->getId()){
                    $find = true;
                    $existes[] = $support;
                }
            }

            if(!$find){
                $em->remove($publish);
            }
        }

        foreach($data->supports as $support){
            if(!in_array($support, $existes)){
                $supports[] = $support;
            }
        }

        $supports = $em->getRepository(ImSupport::class)->findBy(['id' => $supports]);
        foreach($supports as $support){
            $publish = (new ImPublish())
                ->setBien($obj)
                ->setSupport($support)
            ;

            $em->persist($publish);
        }

        return $obj;
    }

    private function addPhotos($em, FileUploader $fileUploader, $folderPhoto, DataImmo $dataEntity,
                               User $user, ImBien $obj, $files, $photos): ImBien
    {
        if ($files) {
            foreach($files as $file){
                foreach($photos as $photo){
                    // si id existe = already uploaded => no reach photo->name
                    // check if isTrash existe and not true to add
                    // check if file is in list
                    if(!isset($photo->id) && !$photo->isTrash && $photo->name == $file->getClientOriginalName()){
                        $fileName = $fileUploader->upload($file, $folderPhoto);

                        $donnee = $dataEntity->setDataPhoto(new ImPhoto(), $photo, $fileName, $user->getAgency());
                        $em->persist($donnee);

                        if((int) $photo->rank == 1){
                            $obj->setMainPhoto($donnee);
                        }


                        $obj->addPhoto($donnee);
                        break;
                    }
                }
            }
        }

        return $obj;
    }

    private function updateRemovePhotos($em, FileUploader $fileUploader, DataImmo $dataEntity, $folderPhoto, $oriPhotos, $photos)
    {
        /** @var ImPhoto $oriPhoto */
        foreach($oriPhotos as $oriPhoto){
            $find = false;
            $nPhoto = null;
            foreach($photos as $photo){
                if(!$photo->isTrash && $photo->uid == $oriPhoto->getUid()){
                    $find = true;
                    $nPhoto = $photo;
                    break;
                }
            }

            if(!$find){
                $fileUploader->deleteFile($oriPhoto->getFile(), $folderPhoto);
                $em->remove($oriPhoto);
            }else{
                $donnee = $dataEntity->setDataPhoto($oriPhoto, $nPhoto, $oriPhoto->getFile(), $oriPhoto->getAgency());
                $em->persist($donnee);
            }
        }
    }

    /**
     * Create a bien
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Bien")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param FileUploader $fileUploader
     * @param DataImmo $dataEntity
     * @param DataDonnee $dataDonnee
     * @param ImmoService $immoService
     * @param HistoryService $historyService
     * @param SerializerInterface $serializer
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator, FileUploader $fileUploader,
                           DataImmo $dataEntity, DataDonnee $dataDonnee, ImmoService $immoService, HistoryService $historyService,
                           SerializerInterface $serializer): JsonResponse
    {
        return $this->submitForm("create", new ImBien(), $request, $apiResponse, $fileUploader, $validator,
            $dataEntity, $dataDonnee, $immoService, $historyService, $serializer);
    }

    /**
     * Update a bien
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Bien")
     *
     * @param ImBien $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param FileUploader $fileUploader
     * @param DataImmo $dataEntity
     * @param DataDonnee $dataDonnee
     * @param ImmoService $immoService
     * @param HistoryService $historyService
     * @param SerializerInterface $serializer
     * @return JsonResponse
     * @throws Exception
     */
    public function update(ImBien $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator, FileUploader $fileUploader,
                           DataImmo $dataEntity, DataDonnee $dataDonnee, ImmoService $immoService, HistoryService $historyService, SerializerInterface $serializer): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $fileUploader, $validator,
            $dataEntity, $dataDonnee, $immoService, $historyService, $serializer);
    }

    /**
     * Update a status
     *
     * @Route("/{id}/{status}", name="status", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Bien")
     *
     * @param ImBien $obj
     * @param $status
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function status(ImBien $obj, $status, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $obj->setStatus($status);

        $obj->setIsArchived($status == ImBien::STATUS_ARCHIVE);

        $em->flush();
        return $apiResponse->apiJsonResponse($obj, User::USER_READ);
    }


    /**
     * Delete a bien
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Bien")
     *
     * @param ImBien $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(ImBien $obj, DataService $dataService): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $publishes = $em->getRepository(ImPublish::class)->findBy(['bien' => $obj]);
        foreach($publishes as $publish){
            $em->remove($publish);
        }

        return $dataService->delete($obj);
    }
}

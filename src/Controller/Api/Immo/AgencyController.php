<?php

namespace App\Controller\Api\Immo;

use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImSettings;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Export;
use App\Service\FileUploader;
use App\Service\Immo\ImmoService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/agencies", name="api_agencies_")
 */
class AgencyController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * Admin - Read agency
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="read", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns agency object"
     * )
     * @OA\Tag(name="Agency")
     *
     * @param ImAgency $obj
     * @param ApiResponse $apiResponse
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function read(ImAgency $obj, ApiResponse $apiResponse, SerializerInterface $serializer): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $users = $em->getRepository(User::class)->findBy(['agency' => $obj]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj]);

        $obj = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        $users = $serializer->serialize($users, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $apiResponse->apiJsonResponseCustom([
            'agency' => $obj,
            'users'=> $users,
            'negotiators' => $negotiators
        ]);
    }

    /**
     * Admin - Create an agency
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new user object"
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\Tag(name="Agency")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @param DataImmo $dataEntity
     * @param ImmoService $immoService
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           FileUploader $fileUploader, DataImmo $dataEntity, ImmoService $immoService): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataAgency(new ImAgency(), $data);

        $file = $request->files->get('logo');
        if ($file) {
            $fileName = $fileUploader->upload($file, ImAgency::FOLDER_LOGO);
            $obj->setLogo($fileName);
        }

        $file = $request->files->get('tarif');
        if ($file) {
            $fileName = $fileUploader->upload($file, ImAgency::FOLDER_TARIF);
            $obj->setTarif($fileName);
        }

        $immoService->initiateSupport($obj);

        $settings = $em->getRepository(ImSettings::class)->findOneBy(['agency' => $obj]);
        if(!$settings){
            $setting = (new ImSettings())
                ->setAgency($obj)
            ;

            $em->persist($setting);
        }

        $negotiator = (new ImNegotiator())
            ->setCode(mb_strtoupper(substr($obj->getName(), 0, 2)))
            ->setFirstname("Négociateur")
            ->setLastname($obj->getName())
            ->setAgency($obj)
        ;

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($negotiator);
        $em->persist($obj);
        $em->flush();

        $settings->setNegotiatorDefault($negotiator->getId());
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Manager - Update an agency
     *
     * @Security("is_granted('ROLE_MANAGER')")
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an user object"
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Agency")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param ImAgency $obj
     * @param FileUploader $fileUploader
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update(Request $request, ValidatorService $validator, ApiResponse $apiResponse, ImAgency $obj,
                           FileUploader $fileUploader, DataImmo $dataEntity): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->get('data'));

        if($data === null){
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataAgency($obj, $data);

        $file = $request->files->get('logo');
        if ($file) {
            $fileName = $fileUploader->replaceFile($file, $obj->getLogo(),ImAgency::FOLDER_LOGO);
            $obj->setLogo($fileName);
        }

        $file = $request->files->get('tarif');
        if ($file) {
            $fileName = $fileUploader->replaceFile($file, $obj->getTarif(),ImAgency::FOLDER_TARIF);
            $obj->setTarif($fileName);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Admin - Delete an agency
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Agency")
     *
     * @param ApiResponse $apiResponse
     * @param ImAgency $obj
     * @param ImmoService $immoService
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, ImAgency $obj, ImmoService $immoService, FileUploader $fileUploader): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $immoService->deleteAgency($obj);

        $em->flush();

        $fileUploader->deleteFile($obj->getLogo(), ImAgency::FOLDER_LOGO);
        $fileUploader->deleteFile($obj->getTarif(), ImAgency::FOLDER_TARIF);
        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Export list agencies
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/export/{format}", name="export", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new agency object",
     * )
     *
     * @OA\Tag(name="Agency")
     *
     * @param Export $export
     * @param $format
     * @return BinaryFileResponse
     */
    public function export(Export $export, $format): BinaryFileResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $objs = $em->getRepository(ImAgency::class)->findAll();
        $data = [];

        $nameFile = 'agences';
        $nameFolder = 'export/';

        foreach ($objs as $obj) {
            $tmp = [
                $obj->getName(),
                $obj->getDirname(),
                $obj->getPhoneLocation(),
                $obj->getPhoneVente(),
                $obj->getEmail(),
                $obj->getWebsite(),
                $obj->getLogo(),
                $obj->getAddress(),
                $obj->getZipcode(),
                $obj->getCity(),
                "",
                $obj->getLat(),
                $obj->getLon(),
                "", "", "", "",
                $obj->getTarif(),
                $obj->getDescription(),
                $obj->getPhone(),
                $obj->getEmailLocation(),
                $obj->getEmailVente()
            ];
            if(!in_array($tmp, $data)){
                $data[] = $tmp;
            }
        }

        $fileName = $nameFile . '.xlsx';
        $header = [['Nom', 'Dirname', 'Téléphone Location', 'Téléphone Vente', 'Adresse e-mail standard', 'Adresse URL',
            'Logo', 'Adresse', 'Code postal', 'Ville', 'Arrondissement', 'Latitude', 'Longitude',
            'Catégorie - locative', 'Catégorie - vente', 'Catégorie - syndic', 'Catégorie - gérance',
            'Tarif', 'Description', 'Téléphone standard', 'Adresse e-mail location', 'Adresse e-mail vente'
        ]];

        $export->createFile($format, 'Liste des ' . $nameFile, $fileName , $header, $data, 22, $nameFolder);
        return new BinaryFileResponse($this->getParameter('private_directory'). $nameFolder . $fileName);
    }
}

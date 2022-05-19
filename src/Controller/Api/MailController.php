<?php

namespace App\Controller\Api;

use App\Entity\Mail;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataMail;
use App\Service\Data\DataService;
use App\Service\FileUploader;
use App\Service\MailerService;
use App\Service\SettingsService;
use Doctrine\Common\Persistence\ManagerRegistry;
use SebastianBergmann\CodeCoverage\Node\File;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/mails", name="api_mails_")
 */
class MailController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Admin - Preview mail
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/preview", name="preview", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of contacts",
     * )
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param SettingsService $settingsService
     * @param ApiResponse $apiResponse
     * @return Response
     */
    public function preview(Request $request, SettingsService $settingsService, ApiResponse $apiResponse): Response
    {
        $data = json_decode($request->get('data'));

        if($data == null){
            return $apiResponse->apiJsonResponseBadRequest("Les données sont vides.");
        }

        $html = $this->renderView('app/email/template/random.html.twig', [
            'subject' => $data->subject,
            'title' => $data->title,
            'message' => $data->message->html,
            'settings' => $settingsService->getSettings()
        ]);

        return new Response($html);
    }

    public function createMail($data, DataMail $dataEntity, SettingsService $settingsService): Mail
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();

        $from = $data->from ?? $settingsService->getEmailExpediteurGlobal();

        $obj = new Mail();
        if($data->isDraft){
            $obj = $em->getRepository(Mail::class)->find($data->id);
            if(!$obj){ $obj = new Mail(); }
        }

        $obj = $dataEntity->setData($obj, $data, $from);
        $obj->setUser($user);

        return $obj;
    }

    /**
     * Create a message contact
     *
     * @Route("/create", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param MailerService $mailerService
     * @param SettingsService $settingsService
     * @param FileUploader $fileUploader
     * @param DataMail $dataEntity
     * @return JsonResponse
     */
    public function create(Request $request, ApiResponse $apiResponse, MailerService $mailerService,
                                   SettingsService $settingsService, FileUploader $fileUploader, DataMail $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data == null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $files = []; $filesName = [];
        for($i = 0; $i <= 5 ; $i++){
            $file = $request->files->get('file' . $i);
            if($file){
                $f = $fileUploader->upload($file, Mail::FOLDER_FILES, false);
                $files[] = $fileUploader->getPrivateDirectory() . Mail::FOLDER_FILES ."/" .$f;
                $filesName[] = $f;
            }
        }

        $from = $data->from ?? $settingsService->getEmailExpediteurGlobal();
        $to = $this->getEmails($data->to);
        $cc = $this->getEmails($data->cc);
        $bcc = $this->getEmails($data->bcc);

        $html = $data->theme == 0 ? "random_classique" : "random";
        $params = $data->theme == 1 ? ['title' => trim($data->title)] : [];

        if($mailerService->sendMailAdvanced(
                $from,
                $to, $cc, $bcc,
                "[" . $settingsService->getWebsiteName() ."] " . trim($data->subject),
                trim($data->subject),
                'app/email/template/' . $html . '.html.twig',
                array_merge($params,  [
                    'subject' => trim($data->subject),
                    'message' => trim($data->message->html),
                    'settings' => $settingsService->getSettings()
                ]),
                $files
            ) != true)
        {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'message',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        $obj = $this->createMail($data, $dataEntity, $settingsService);
        $obj->setStatusOrigin(Mail::STATUS_SENT);
        $obj->setStatus(Mail::STATUS_SENT);
        $obj->setFiles($filesName);

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Message envoyé. La page va se rafraichir automatiquement dans 3 secondes.");
    }

    /**
     * @Route("/draft", name="draft", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param SettingsService $settingsService
     * @param DataMail $dataEntity
     * @return JsonResponse
     */
    public function draft(Request $request, ApiResponse $apiResponse, SettingsService $settingsService, DataMail $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data == null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $this->createMail($data, $dataEntity, $settingsService);
        $obj->setStatusOrigin(Mail::STATUS_DRAFT);
        $obj->setStatus(Mail::STATUS_DRAFT);

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, Mail::MAIL_READ);
    }

    private function getEmails($data): array
    {
        $emails = [];
        foreach($data as $email){
            $emails[] = $email->value;
        }

        return $emails;
    }

    /**
     * @Route("/trash/{id}", name="trash", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Mail $obj
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function trash(Mail $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $obj->setStatus(Mail::STATUS_TRASH);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, Mail::MAIL_READ);
    }

    /**
     * @Route("/restore/{id}", name="restore", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Mail $obj
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function restore(Mail $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $obj->setStatus($obj->getStatusOrigin());
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, Mail::MAIL_READ);
    }

    /**
     * @Route("/delete/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Mail $obj
     * @param DataService $dataService
     * @param MailerService $mailerService
     * @return JsonResponse
     */
    public function delete(Mail $obj, DataService $dataService, MailerService $mailerService): JsonResponse
    {
        $mailerService->unlinkFiles($obj);
        return $dataService->delete($obj);
    }

    /**
     * @Route("/trash-group", name="trash_group", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function trashGroup(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        $objs = $em->getRepository(Mail::class)->findBy(['id' => $data]);
        foreach($objs as $obj){
            $obj->setStatus(Mail::STATUS_TRASH);
        }
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Ok");
    }

    /**
     * @Route("/restore-group", name="restore_group", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function restoreGroup(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        $objs = $em->getRepository(Mail::class)->findBy(['id' => $data]);
        foreach($objs as $obj){
            $obj->setStatus($obj->getStatusOrigin());
        }
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Ok");
    }

    /**
     * @Route("/delete-group", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param MailerService $mailerService
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse, MailerService $mailerService): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository(Mail::FOLDER_FILES)->findBy(['id' => json_decode($request->getContent())]);

        if ($objs) {
            /** @var Mail $obj */
            foreach ($objs as $obj) {
                $mailerService->unlinkFiles($obj);
                $em->remove($obj);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}

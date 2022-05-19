<?php


namespace App\Service;


use App\Entity\Mail;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Serializer\SerializerInterface;

class MailerService
{
    private $mailer;
    private $settingsService;
    private $em;
    private $serializer;
    private $fileUploader;

    public function __construct(MailerInterface $mailer, SettingsService $settingsService,
                                EntityManagerInterface $entityManager, SerializerInterface $serializer,
                                FileUploader $fileUploader)
    {
        $this->mailer = $mailer;
        $this->settingsService = $settingsService;
        $this->em = $entityManager;
        $this->serializer = $serializer;
        $this->fileUploader = $fileUploader;
    }

    public function getAllMailsData(User $user): array
    {
        $sent  = $this->getMailsDataSerialize($user, Mail::STATUS_SENT);
        $trash = $this->getMailsDataSerialize($user, Mail::STATUS_TRASH);
        $draft = $this->getMailsDataSerialize($user, Mail::STATUS_DRAFT);

        return [
            "sent" => $sent,
            "trash" => $trash,
            "draft" => $draft,
        ];
    }

    public function getMailsDataSerialize(User $user, $status): string
    {
        $data = $this->em->getRepository(Mail::class)->findBy(['user' => $user, 'status' => $status], ['createdAt' => 'DESC']);

        return $this->serializer->serialize($data, 'json', ['groups' => Mail::MAIL_READ]);
    }

    public function unlinkFiles(Mail $obj)
    {
        foreach($obj->getFiles() as $filename){
            $file = $this->fileUploader->getPrivateDirectory() . Mail::FOLDER_FILES . '/' . $filename;
            if(file_exists($file)){
                unlink($file);
            }
        }
    }

    public function sendMail($to, $subject, $text, $html, $params, $from=null)
    {
        $from = ($from == null) ? $this->settingsService->getEmailExpediteurGlobal() : $from;

        $email = (new TemplatedEmail())
            ->from($from)
            ->to(new Address($to))
            ->subject($subject)
            ->text($text)
            ->htmlTemplate($html)
            ->context($params)
        ;

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }

    public function sendMailCCGroup($to, $subject, $text, $html, $params, $from=null)
    {
        $from = ($from == null) ? $this->settingsService->getEmailExpediteurGlobal() : $from;

        $email = (new TemplatedEmail())
            ->from($from)
            ->bcc(...$to)
            ->subject($subject)
            ->text($text)
            ->htmlTemplate($html)
            ->context($params)
        ;

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }

    public function sendMailAdvanced($from, $to, $cc, $bcc, $subject, $text, $html, $params, $files = [])
    {
        $from = ($from == null) ? $this->settingsService->getEmailExpediteurGlobal() : $from;

        $email = (new TemplatedEmail())
            ->from($from)
            ->subject($subject)
            ->text($text)
            ->htmlTemplate($html)
            ->context($params)
        ;

        if(count($to) > 0){  $email->to(...$to); }
        if(count($cc) > 0){  $email->cc(...$cc); }
        if(count($bcc) > 0){ $email->bcc(...$bcc); }

        /** @var UploadedFile $file */
        foreach($files as $file){
            $email->attachFromPath($file);
        }

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }
}

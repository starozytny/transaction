<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImSuiviRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImSuiviRepository::class)
 */
class ImSuivi
{
    const SUIVI_READ = ["suivi:read"];

    const STATUS_TO_PROCESS = 0;
    const STATUS_PROCESSING = 1;
    const STATUS_PROCESSED = 2;
    const STATUS_END = 3;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"suivi:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"suivi:read"})
     */
    private $status = self::STATUS_TO_PROCESS;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, inversedBy="suivis")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $bien;

    /**
     * @ORM\ManyToOne(targetEntity=ImProspect::class, fetch="EAGER", inversedBy="suivis")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"suivi:read"})
     */
    private $prospect;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $commentary;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBien(): ?ImBien
    {
        return $this->bien;
    }

    public function setBien(?ImBien $bien): self
    {
        $this->bien = $bien;

        return $this;
    }

    public function getProspect(): ?ImProspect
    {
        return $this->prospect;
    }

    public function setProspect(?ImProspect $prospect): self
    {
        $this->prospect = $prospect;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCommentary(): ?string
    {
        return $this->commentary;
    }

    public function setCommentary(?string $commentary): self
    {
        $this->commentary = $commentary;

        return $this;
    }

    /**
     * @return string
     * @Groups({"suivi:read"})
     */
    public function getStatusString(): string
    {
        $values = ["A traiter", "En cours", "Traité", "Terminé"];

        return $values[$this->status];
    }
}

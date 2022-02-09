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

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"suivi:read"})
     */
    private $id;

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
}

<?php

namespace App\Entity\Immo;

use App\Entity\Agenda\AgEvent;
use App\Repository\Immo\ImVisitRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImVisitRepository::class)
 */
class ImVisit
{
    const VISIT_READ = ["visit:read"];
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"visit:read", "agenda:read"})
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity=AgEvent::class, inversedBy="imVisit", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"visit:read"})
     */
    private $agEvent;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, fetch="EAGER", inversedBy="visits")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"visit:read", "agenda:read"})
     */
    private $bien;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAgEvent(): ?AgEvent
    {
        return $this->agEvent;
    }

    public function setAgEvent(AgEvent $agEvent): self
    {
        $this->agEvent = $agEvent;

        return $this;
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
}

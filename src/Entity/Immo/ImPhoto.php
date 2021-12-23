<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImPhotoRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImPhotoRepository::class)
 */
class ImPhoto
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $file;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $legend;

    /**
     * @ORM\Column(type="float")
     */
    private $size;

    /**
     * @ORM\Column(type="integer")
     */
    private $rank;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, inversedBy="photos")
     * @ORM\JoinColumn(nullable=false)
     */
    private $bien;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(string $file): self
    {
        $this->file = $file;

        return $this;
    }

    public function getLegend(): ?string
    {
        return $this->legend;
    }

    public function setLegend(?string $legend): self
    {
        $this->legend = $legend;

        return $this;
    }

    public function getSize(): ?float
    {
        return $this->size;
    }

    public function setSize(?float $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getRank(): ?int
    {
        return $this->rank;
    }

    public function setRank(int $rank): self
    {
        $this->rank = $rank;

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

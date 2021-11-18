<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImBienRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImBienRepository::class)
 */
class ImBien
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $codeTypeAd;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCodeTypeAd(): ?int
    {
        return $this->codeTypeAd;
    }

    public function setCodeTypeAd(int $codeTypeAd): self
    {
        $this->codeTypeAd = $codeTypeAd;

        return $this;
    }
}

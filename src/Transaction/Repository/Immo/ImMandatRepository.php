<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImMandat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImMandat|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImMandat|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImMandat[]    findAll()
 * @method ImMandat[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImMandatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImMandat::class);
    }

    // /**
    //  * @return ImMandat[] Returns an array of ImMandat objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ImMandat
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

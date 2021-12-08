<?php

namespace App\Repository\Immo;

use App\Entity\Immo\ImArea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImArea|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImArea|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImArea[]    findAll()
 * @method ImArea[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImAreaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImArea::class);
    }

    // /**
    //  * @return ImArea[] Returns an array of ImArea objects
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
    public function findOneBySomeField($value): ?ImArea
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

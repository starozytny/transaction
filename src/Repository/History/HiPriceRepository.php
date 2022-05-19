<?php

namespace App\Repository\History;

use App\Entity\History\HiPrice;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method HiPrice|null find($id, $lockMode = null, $lockVersion = null)
 * @method HiPrice|null findOneBy(array $criteria, array $orderBy = null)
 * @method HiPrice[]    findAll()
 * @method HiPrice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HiPriceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HiPrice::class);
    }

    // /**
    //  * @return HiPrice[] Returns an array of HiPrice objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('h.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?HiPrice
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

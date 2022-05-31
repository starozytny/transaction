<?php

namespace App\Transaction\Repository\Donnee;

use App\Transaction\Entity\Donnee\DoQuartier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method DoQuartier|null find($id, $lockMode = null, $lockVersion = null)
 * @method DoQuartier|null findOneBy(array $criteria, array $orderBy = null)
 * @method DoQuartier[]    findAll()
 * @method DoQuartier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DoQuartierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DoQuartier::class);
    }

    // /**
    //  * @return DoQuartier[] Returns an array of DoQuartier objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DoQuartier
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

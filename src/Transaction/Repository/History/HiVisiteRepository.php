<?php

namespace App\Transaction\Repository\History;

use App\Transaction\Entity\History\HiVisite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method HiVisite|null find($id, $lockMode = null, $lockVersion = null)
 * @method HiVisite|null findOneBy(array $criteria, array $orderBy = null)
 * @method HiVisite[]    findAll()
 * @method HiVisite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HiVisiteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HiVisite::class);
    }

    // /**
    //  * @return HiVisite[] Returns an array of HiVisite objects
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
    public function findOneBySomeField($value): ?HiVisite
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

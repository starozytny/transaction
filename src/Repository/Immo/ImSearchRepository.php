<?php

namespace App\Repository\Immo;

use App\Entity\Immo\ImSearch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImSearch|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImSearch|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImSearch[]    findAll()
 * @method ImSearch[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImSearchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImSearch::class);
    }

    // /**
    //  * @return ImSearch[] Returns an array of ImSearch objects
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
    public function findOneBySomeField($value): ?ImSearch
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

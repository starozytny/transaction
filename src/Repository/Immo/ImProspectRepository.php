<?php

namespace App\Repository\Immo;

use App\Entity\Immo\ImProspect;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImProspect|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImProspect|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImProspect[]    findAll()
 * @method ImProspect[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImProspectRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImProspect::class);
    }

    // /**
    //  * @return ImProspect[] Returns an array of ImProspect objects
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
    public function findOneBySomeField($value): ?ImProspect
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

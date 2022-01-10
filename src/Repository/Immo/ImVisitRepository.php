<?php

namespace App\Repository\Immo;

use App\Entity\Immo\ImVisit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImVisit|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImVisit|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImVisit[]    findAll()
 * @method ImVisit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImVisitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImVisit::class);
    }

    // /**
    //  * @return ImVisit[] Returns an array of ImVisit objects
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
    public function findOneBySomeField($value): ?ImVisit
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

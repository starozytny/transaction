<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImConfidential;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImConfidential|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImConfidential|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImConfidential[]    findAll()
 * @method ImConfidential[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImConfidentialRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImConfidential::class);
    }

    // /**
    //  * @return ImConfidential[] Returns an array of ImConfidential objects
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
    public function findOneBySomeField($value): ?ImConfidential
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

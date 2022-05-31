<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImSupport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImSupport|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImSupport|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImSupport[]    findAll()
 * @method ImSupport[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImSupportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImSupport::class);
    }

    // /**
    //  * @return ImSupport[] Returns an array of ImSupport objects
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
    public function findOneBySomeField($value): ?ImSupport
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

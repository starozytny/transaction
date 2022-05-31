<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImTenant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImTenant|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImTenant|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImTenant[]    findAll()
 * @method ImTenant[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImTenantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImTenant::class);
    }

    // /**
    //  * @return ImTenant[] Returns an array of ImTenant objects
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
    public function findOneBySomeField($value): ?ImTenant
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

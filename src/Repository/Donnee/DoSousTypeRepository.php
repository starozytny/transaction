<?php

namespace App\Repository\Donnee;

use App\Entity\Donnee\DoSousType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method DoSousType|null find($id, $lockMode = null, $lockVersion = null)
 * @method DoSousType|null findOneBy(array $criteria, array $orderBy = null)
 * @method DoSousType[]    findAll()
 * @method DoSousType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DoSousTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DoSousType::class);
    }

    // /**
    //  * @return DoSousType[] Returns an array of DoSousType objects
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
    public function findOneBySomeField($value): ?DoSousType
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

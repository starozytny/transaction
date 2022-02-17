<?php

namespace App\Repository\Donnee;

use App\Entity\Donnee\DoSol;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method DoSol|null find($id, $lockMode = null, $lockVersion = null)
 * @method DoSol|null findOneBy(array $criteria, array $orderBy = null)
 * @method DoSol[]    findAll()
 * @method DoSol[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DoSolRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DoSol::class);
    }

    // /**
    //  * @return DoSol[] Returns an array of DoSol objects
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
    public function findOneBySomeField($value): ?DoSol
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

<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImLocalisation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImLocalisation|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImLocalisation|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImLocalisation[]    findAll()
 * @method ImLocalisation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImLocalisationRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImLocalisation::class);
//    }

    // /**
    //  * @return ImLocalisation[] Returns an array of ImLocalisation objects
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
    public function findOneBySomeField($value): ?ImLocalisation
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

<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImRoom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImRoom|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImRoom|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImRoom[]    findAll()
 * @method ImRoom[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImRoomRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImRoom::class);
//    }

    // /**
    //  * @return ImRoom[] Returns an array of ImRoom objects
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
    public function findOneBySomeField($value): ?ImRoom
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

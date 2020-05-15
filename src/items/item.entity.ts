import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  weight: number;

  @Column({ nullable: true })
  purchaseDate: Date;

  @Column({ nullable: true })
  purchaseDetails: string;

  @Column({ nullable: true })
  purchaseLocation: string;

  @ManyToOne(type => Category, category => category.items, { eager: false })
  category: Category;

  @Column()
  categoryId: number;

  @ManyToOne(type => User, user => user.items, { eager: false })
  user: User;

  @Column()
  userId: number;
}

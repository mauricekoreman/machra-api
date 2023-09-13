import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  year_of_story: number;

  @Column()
  isReviewed: boolean;

  @Column({ type: 'date' })
  @CreateDateColumn()
  created_at: string;
}

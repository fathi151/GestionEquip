export class Position {
  id!: string;
  title!: string;
}

export class Job {
  id!: number;
  title!: string;
}

export class Harbor {
  id!: number;
  name!: string;
  location!: string;
}

export class Status {
  id!: number;
  title!: string;
}

export class Utilisateur {
  registrationNumber!: string;

  firstName!: string;
  lastName!: string;
  phoneNumber!: string;
  cin!: string;
  grade!: string;
  employment!: string;
  college!: string;

  startingDate!: Date;
  dob!: Date;
  recruitmentDate!: Date;

  position!: Position;
  job!: Job;
  harbor!: Harbor;
  status!: Status;

  username!: string;
  email!: string;
  password!: string;
  role!: string;

  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  }
}

export class Agent {
  id!: number;
  email!: string;
  gender!: string;
  phoneNumber!: string;
  user!: Utilisateur;
  username!: string;
  password!: string;
  role!: string;
}

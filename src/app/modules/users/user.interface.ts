export type User = {
  id: string;
  password: string;
  needsPassChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'active' | 'blocked';
  isDeleted: boolean;
};

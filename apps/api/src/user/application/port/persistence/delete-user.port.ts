export interface DeleteUserPort {
  deleteUser(userId: string): Promise<boolean>;
}

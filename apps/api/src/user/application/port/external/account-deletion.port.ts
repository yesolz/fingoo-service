export interface AccountDeletionPort {
  deleteUser(userId: string): Promise<boolean>;
}

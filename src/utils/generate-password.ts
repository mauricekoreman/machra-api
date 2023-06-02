import * as bcrypt from 'bcrypt';

export async function generatePassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

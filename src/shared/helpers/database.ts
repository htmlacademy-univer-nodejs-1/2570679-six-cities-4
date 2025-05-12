export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: string,
  databaseName: string,
): string {
  console.log(username);
  console.log(password);
  return `mongodb://${host}:${port}/${databaseName}?authSource=admin`;
}

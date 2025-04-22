import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// const db = drizzle(process.env.DATABASE_URL);

let globalInstance: any;
export async function getDb(env: Env) {
  // if (globalInstance) {
  //   return globalInstance;
  // }

  // Path to the CA certificate
  // const caCertPath = path.resolve(process.cwd(), "apps/mtmag/tembo.io.ca/ca.crt");

  // Read the CA certificate
  // const caCert = fs.readFileSync(caCertPath, "utf8");

  const caBytes = `-----BEGIN CERTIFICATE-----
MIICBDCCAamgAwIBAgIRAPA4871PSrzciUmu6YdAb9QwCgYIKoZIzj0EAwIwRTEO
MAwGA1UEChMFdGVtYm8xFDASBgNVBAsTC2VuZ2luZWVyaW5nMR0wGwYDVQQDExRk
YXRhLTEudXNlMS50ZW1iby5pbzAeFw0yNTA0MTIxODMxMjVaFw0yNTA3MTExODMx
MjVaMEUxDjAMBgNVBAoTBXRlbWJvMRQwEgYDVQQLEwtlbmdpbmVlcmluZzEdMBsG
A1UEAxMUZGF0YS0xLnVzZTEudGVtYm8uaW8wWTATBgcqhkjOPQIBBggqhkjOPQMB
BwNCAARtP1Kx2rxDmGkwWFmqw0snJZyMfrBs1Fejhsg+3X+qQGFHmFJ4rKrKbpt/
uqF4GTbryQNtCfG8o86oZGglMLsjo3oweDAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0T
AQH/BAUwAwEB/zAdBgNVHQ4EFgQUqTbXl+W22irBuFjMkT5HYIB5CtowNgYDVR0R
BC8wLYIVZGF0YS0xLnVzZTEuY29yZWRiLmlvghRkYXRhLTEudXNlMS50ZW1iby5p
bzAKBggqhkjOPQQDAgNJADBGAiEAivkxeo1Cilt0aq/S4ByYVa+fOUHT3up4TAYQ
+DuSrAECIQDx49IZMQU+pv/Mr8r5EJu76Fj7kYjLMDQgCMZdydrVFA==
-----END CERTIFICATE-----
`;

  // Create a postgres client with the CA certificate
  // const queryClient = postgres(
  //   `${env.MTMAG_DATABASE_URL}?sslmode=require`,
  //   // {
  //   //   ssl: {
  //   //     ca: caBytes,
  //   //     rejectUnauthorized: true, // Now we can validate certificates properly
  //   //   },
  //   // },
  //   {
  //     ssl: {
  //       ca: caBytes,
  //     },
  //   },
  // );

  // Create drizzle instance with the postgres client
  const db = drizzle(`${env.MTMAG_DATABASE_URL}?sslmode=require`);

  // const pool = new Pool({
  //   connectionString: `${env.MTMAG_DATABASE_URL}?sslmode=verify-ca`,
  //   ssl: {
  //     // Please re-download this certificate at least monthly to avoid expiry
  //     ca: caBytes,
  //     rejectUnauthorized: true,
  //   },
  // });
  // const db = drizzle(
  //   `${env.MTMAG_DATABASE_URL}?sslmode=require&sslrootcert=/home/user/workspace/mtx/apps/mtmag/tembo.io.ca/ca.crt`,
  // );

  // const client = await pool.connect();
  // try {
  //   const response = await client.query("SELECT 1");
  //   console.log(response.rows[0]["?column?"]);
  // } catch (e) {
  //   console.error(e);
  // } finally {
  //   client.release();
  // }

  // const db = drizzle(pool);

  globalInstance = db;
  return db;
}

/**
 * openssl x509 -in /home/user/workspace/mtx/apps/mtmag/tembo.io.ca/ca.crt -text -noout | head -20
 *
 */

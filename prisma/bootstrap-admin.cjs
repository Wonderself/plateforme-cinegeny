/* eslint-disable @typescript-eslint/no-require-imports */
// One-shot admin bootstrap — plain Node (no ts-node), so it runs reliably
// inside the production container. Creates OR resets a single admin account,
// without injecting any demo data. Triggered from start.sh when
// ADMIN_BOOTSTRAP=true. Override via ADMIN_EMAIL / ADMIN_PASSWORD.
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('❌ DATABASE_URL non défini — bootstrap admin impossible.')
    process.exit(1)
  }

  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15000 })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const email = (process.env.ADMIN_EMAIL || 'admin@lumiere.film').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'Admin99999!!'
  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', isVerified: true },
    create: {
      email,
      passwordHash,
      displayName: 'Admin',
      role: 'ADMIN',
      level: 'VIP',
      isVerified: true,
      verifiedAt: new Date(),
    },
  })

  console.log(`✅ Admin prêt : ${user.email} (rôle ${user.role})`)
  await pool.end()
}

main().catch(async (e) => {
  console.error('❌ Bootstrap admin échoué :', e)
  process.exit(1)
})

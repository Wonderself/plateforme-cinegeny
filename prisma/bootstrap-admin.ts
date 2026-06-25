import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

/**
 * One-shot admin bootstrap — creates OR resets a single admin account,
 * without injecting any demo data. Triggered from start.sh when
 * ADMIN_BOOTSTRAP=true.
 *
 * Configurable via env (so you can use your real address):
 *   ADMIN_EMAIL     (default: admin@lumiere.film)
 *   ADMIN_PASSWORD  (default: Admin99999!!)
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
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
}

main()
  .then(async () => {
    await pool.end()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error('❌ Bootstrap admin échoué :', e)
    await pool.end().catch(() => {})
    process.exit(1)
  })

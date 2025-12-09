import { prisma } from '../src/utils/prisma';
import { createUser } from '../src/services/user.service';
import { Role } from '@prisma/client';

async function createAdminUser() {
  try {
    const adminEmail = 'admin@example.com';
    
    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists:', adminEmail);
      return;
    }

    // Tạo admin user
    const admin = await createUser(
      adminEmail,
      'AdminPass123',
      'System Administrator',
      Role.ADMIN
    );

    console.log('✅ Admin user created successfully:');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: AdminPass123');
    console.log('👤 Role:', admin.role);
    console.log('🆔 ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

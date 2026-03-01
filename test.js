const db = require('./src/config/db');
const service = require('./src/services/dbService');

(async () => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('Koneksi berhasil:', rows);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Tabel users tersedia.');

    console.log('\n-- SELECT ALL users');
    const allUsers = await service.selectAll('users');
    console.log(allUsers);

    console.log('\n-- SELECT user by id');
    const user1 = await service.selectById('users', 1);
    console.log(user1);

    console.log('\n-- SELECT where attribute');
    const bob = await service.selectWhere('users', { name: 'Bob' });
    console.log(bob);

    console.log('\n-- INSERT new user');
    const insertResult = await service.insert('users', { name: 'Alice', email: 'alice@example.com' });
    console.log('insertId:', insertResult.insertId);

    console.log('\n-- UPDATE user with id 1');
    const updateResult = await service.updateById('users', 1, { email: 'newbob@example.com' });
    console.log('affectedRows:', updateResult.affectedRows);

    console.log('\n-- DELETE user with id 2');
    const deleteResult = await service.deleteById('users', 2);
    console.log('deletedRows:', deleteResult.affectedRows);
  } catch (err) {
    console.error('Error during operations:', err);
  }
})();
// src/services/dbService.js
// Generic database service wrapping MySQL queries using the pool defined in config/db.js

const pool = require('../config/db');

/**
 * Execute a raw query and return results.
 * @param {string} sql
 * @param {Array} params
 */
async function execute(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * Select all rows from a table.
 * @param {string} table
 */
async function selectAll(table) {
  return execute(`SELECT * FROM ??`, [table]);
}

/**
 * Select rows by id (assumes column name is `id`).
 * @param {string} table
 * @param {number|string} id
 */
async function selectById(table, id) {
  return execute(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
}

/**
 * Select rows using arbitrary conditions object.
 * Conditions object keys will be joined with AND.
 * @param {string} table
 * @param {Object} conditions
 */
async function selectWhere(table, conditions) {
  const keys = Object.keys(conditions);
  if (keys.length === 0) return selectAll(table);
  const clause = keys.map(k => `?? = ?`).join(' AND ');
  const params = [];
  keys.forEach(k => {
    params.push(k, conditions[k]);
  });
  return execute(
    `SELECT * FROM ?? WHERE ${clause}`,
    [table, ...params]
  );
}

/**
 * Insert a row into a table. data is an object mapping columns to values.
 * Returns insertId via result object.
 * @param {string} table
 * @param {Object} data
 */
async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(_ => '?').join(', ');
  const sql = `INSERT INTO ?? (${keys.map(_ => '??').join(', ')}) VALUES (${placeholders})`;
  const [result] = await pool.query(sql, [table, ...keys, ...values]);
  return result;
}

/**
 * Update a row by id.
 * @param {string} table
 * @param {number|string} id
 * @param {Object} data
 */
async function updateById(table, id, data) {
  const keys = Object.keys(data);
  const setClause = keys.map(_ => '?? = ?').join(', ');
  const params = [];
  keys.forEach(k => {
    params.push(k, data[k]);
  });
  params.push(id);
  const sql = `UPDATE ?? SET ${setClause} WHERE id = ?`;
  const [result] = await pool.query(sql, [table, ...params]);
  return result;
}

/**
 * Delete a row by id.
 * @param {string} table
 * @param {number|string} id
 */
async function deleteById(table, id) {
  const [result] = await pool.query(`DELETE FROM ?? WHERE id = ?`, [table, id]);
  return result;
}

module.exports = {
  execute,
  selectAll,
  selectById,
  selectWhere,
  insert,
  updateById,
  deleteById,
};

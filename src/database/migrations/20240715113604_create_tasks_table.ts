import { Knex } from "knex";

const TABLE_NAME = "tasks";

/**
 * Create table tasks.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();

    table.string("title").notNullable();

    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");

    table
      .bigInteger("status_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tasks_status");

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table
      .bigInteger("created_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable(TABLE_NAME);

    table.timestamp("updated_at").nullable();

    table
      .bigInteger("updated_by")
      .unsigned()
      .references("id")
      .inTable(TABLE_NAME)
      .nullable();
  });
}

/**
 * Drop table tasks.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}

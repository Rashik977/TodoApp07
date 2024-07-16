import { Knex } from "knex";
import { TASK_STATUS } from "../../constants/TaskStatus";

const TABLE_NAME = "tasks_status";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          status: TASK_STATUS.NOTSTARTED,
        },
        {
          status: TASK_STATUS.PENDING,
        },
        {
          status: TASK_STATUS.DONE,
        },
      ]);
    });
}

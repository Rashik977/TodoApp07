import { Knex } from "knex";

const TABLE_NAME = "tasks";

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
          title: "walk the dog",
          user_id: 1,
          status_id: 1,
        },
        {
          title: "clean the house",
          user_id: 2,
          status_id: 2,
        },
        {
          title: "do the laundry",
          user_id: 2,
          status_id: 3,
        },
        {
          title: "wash the car",
          user_id: 3,
          status_id: 1,
        },
        {
          title: "mow the lawn",
          user_id: 3,
          status_id: 2,
        },
        {
          title: "take out the trash",
          user_id: 3,
          status_id: 2,
        },
      ]);
    });
}

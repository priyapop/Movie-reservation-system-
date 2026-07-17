/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */


export const up = (pgm) => {
  pgm.createTable("hall", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    hall_number: { type: "VARCHAR(10)", notNull: true },
    theater_id:{
        type: "uuid",
      notNull: true,
      references: "theater",
    },
    seat_capacity:{type:"integer",notNull: true},
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
    pgm.addConstraint("hall", "hall_theater_hallnumber_unique", {
    unique: ["theater_id", "hall_number"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("hall");
};

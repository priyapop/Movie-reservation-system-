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
  pgm.createTable("ticket", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    seat_id: {
      type: "uuid",
      notNull: true,
      references: "seat",
    },
    reservation_id: {
      type: "uuid",
      notNull: true,
      references: "reservation",
      onDelete: "CASCADE",
    },
    showtime_id: {
      type: "uuid",
      notNull: true,
      references: "showtime",
    },
    price: { type: "numeric", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("ticket", "seat_id_showtime_id_unique", {
    unique: ["seat_id", "showtime_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("ticket");
};

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
  pgm.createTable("payment", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    reservation_id: {
      type: "uuid",
      notNull: true,
      references: "reservation",
      onDelete: "CASCADE",
    },
    payment_method: {
      type: "text",
      notNull: true,
      default: "mock",
    },
    transaction_id: { type: "text" },
    status: {
      type: "text",
      notNull: true,
      default: "pending",
      check: "status IN ('pending', 'succeeded', 'failed','refunded' )",
    },
    total_amount: { type: "numeric(10,2)", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("payment");
};

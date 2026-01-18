module.exports = (sequelize, Sequelize) => {
  const ShoppingItem = sequelize.define("shopping_items", {
    id: {
      type: Sequelize.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    list_id: {
      type: Sequelize.STRING(36),
      allowNull: false,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    position: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return ShoppingItem;
};

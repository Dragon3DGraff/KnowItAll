module.exports = (sequelize, Sequelize) => {
  const ListRefused = sequelize.define("list_refused", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    list_id: {
      type: Sequelize.STRING(36),
      allowNull: false,
    },
  }, {
    indexes: [
      { unique: true, fields: ["user_id", "list_id"] },
    ],
  });

  return ListRefused;
};

module.exports = (sequelize, Sequelize) => {
  const ListBlockedUser = sequelize.define("list_blocked_user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    blocker_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    blocked_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    indexes: [
      { unique: true, fields: ["blocker_id", "blocked_id"] },
    ],
  });

  return ListBlockedUser;
};

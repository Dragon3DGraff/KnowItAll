module.exports = (sequelize, Sequelize) => {
  const Shopping = sequelize.define("shopping", {
    id: {
      type: Sequelize.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    owner_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    members: {
      type: Sequelize.JSON,
      defaultValue: [],
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return Shopping;
};

module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("students", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    birthdate: {
      type: Sequelize.STRING,
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    registered: {
      type: Sequelize.DATE,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  return Users;
};

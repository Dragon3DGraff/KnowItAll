module.exports = (sequelize, Sequelize) => {
  const Results = sequelize.define("multiplation", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
    },
    timer: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    mode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    results: {
      type: Sequelize.JSON,
      allowNull: false,
    },

    correctCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    incorrectCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    solvedCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    numbers: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Results;
};

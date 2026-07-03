module.exports = (sequelize, Sequelize) => {
  const BookBookmark = sequelize.define("book_bookmark", {
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
    book_id: {
      type: Sequelize.STRING(512),
      allowNull: false,
    },
    label: {
      type: Sequelize.STRING(256),
      allowNull: false,
    },
    position: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  });

  return BookBookmark;
};

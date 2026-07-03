module.exports = (sequelize, Sequelize) => {
  const BookProgress = sequelize.define(
    "book_progress",
    {
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
      view_mode: {
        type: Sequelize.STRING(16),
        allowNull: false,
        defaultValue: "scroll",
      },
      font_size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 18,
      },
      position: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: { chapterIndex: 0, pageIndex: 0, scrollTop: 0 },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["user_id", "book_id"],
        },
      ],
    }
  );

  return BookProgress;
};

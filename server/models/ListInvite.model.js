module.exports = (sequelize, Sequelize) => {
  const ListInvite = sequelize.define("list_invite", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    list_id: {
      type: Sequelize.STRING(36),
      allowNull: false,
    },
    inviter_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    invitee_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    indexes: [
      { unique: true, fields: ["list_id", "invitee_id"] },
    ],
  });

  return ListInvite;
};

export default function initResourceModel(sequelize, DataTypes) {
  return sequelize.define(
    'resource', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      resourceName: {
        type: DataTypes.STRING,
      },
      resourceLink: {
        type: DataTypes.STRING,
      },
      skillId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'skills',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
    },
  );
}

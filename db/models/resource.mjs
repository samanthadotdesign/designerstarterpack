export default function initResourceModel(sequelize, DataTypes) {
  return sequelize.define(
    'resource', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      resource_name: {
        type: DataTypes.STRING,
      },
      resource_link: {
        type: DataTypes.STRING,
      },
      skill_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'skills',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
    },
  );
}

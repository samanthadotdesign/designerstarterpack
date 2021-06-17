export default function initSectionModel(sequelize, DataTypes) {
  return sequelize.define(
    'section', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      section_name: {
        type: DataTypes.STRING,
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

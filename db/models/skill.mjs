export default function initSkillModel(sequelize, DataTypes) {
  return sequelize.define(
    'skill', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      skill_name: {
        type: DataTypes.STRING,
      },
      skill_img: {
        type: DataTypes.STRING,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
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

export default function initCategoryModel(sequelize, DataTypes) {
  return sequelize.define(
    'category', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      category_name: {
        type: DataTypes.STRING,
      },
      category_img: {
        type: DataTypes.STRING,
      },
      section_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'sections',
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

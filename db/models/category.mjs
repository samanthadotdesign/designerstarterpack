export default function initCategoryModel(sequelize, DataTypes) {
  return sequelize.define(
    'category', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      categoryName: {
        type: DataTypes.STRING,
      },
      categoryImg: {
        type: DataTypes.STRING,
      },
      sectionId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'sections',
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

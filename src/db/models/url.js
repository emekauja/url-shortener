module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define(
    'url',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      longUrl: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      shortUrl: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      tableName: 'url',
      indexes: [
        {
          unique: false,
          fields: ['longUrl'],
        },
      ],
    }
  );
  return Url;
};

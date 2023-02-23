const { DataTypes } = require('sequelize');
const { Model } = require('sequelize');

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    min: 6
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored,
                modelName: 'User',
                tableName: 'user',
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'
            }
        );
    }
};

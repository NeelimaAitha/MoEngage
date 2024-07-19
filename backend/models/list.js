const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('moengage', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

const List = sequelize.define('List', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const ListItem = sequelize.define('ListItem', {
    response_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    list_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

List.hasMany(ListItem, { foreignKey: 'list_id' });
ListItem.belongsTo(List, { foreignKey: 'list_id' });

module.exports = { List, ListItem };

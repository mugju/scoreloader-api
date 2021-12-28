const sequelize_ = require('sequelize');

module.exports = class Domain extends sequelize_.Model {
    static init(sequelize){
        return super.init({
            host : {
                type : sequelize_.STRING(80),
                allowNull : false,
            },
            type : {
                type : sequelize_.ENUM('premium','free'),
                allowNull : false,
            },
            clientSecret : {
                type : sequelize_.UUID,
                allowNull : false,
            },

        },{
            sequelize,
            //테이블 옵션으로 timestamps와 paranoid가 true로 주어졌으므로 createAt, updateAt, deleteAt 컬럼도 생성 된다.
            timestamps : true,
            paranoid : true,
            modelName: 'Domain',
            tableName : 'Domains',
        });
    }
    static associate(db) {
        db.Domain.belongsTo(db.User);
    }
};
const Sequelize = require("sequelize");
const db= require("../config/Database.js");
 
const { DataTypes } = Sequelize;
 
const Users = db.define('rajatMassege',{
    name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
  
},{
    // freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 


module.exports = Users;
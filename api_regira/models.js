// Es defineix la configuració de sequelize
const {Sequelize, DataTypes} = require('sequelize'); // Importa la llibreria Sequelize

const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes

const sequelize = new Sequelize('regira', 'root', 'admin', {
 // host: 'localhost',
  host: '192.168.1.158', //IP de la base de dades
  port: 3306,
  dialect: 'mysql' // connectem a mysql
});



// Model per a la taula Projectes
const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: {
    type: DataTypes.STRING
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
});

// Model per a la taula Issues
const Issue = sequelize.define('Issue', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.ENUM('bug', 'feature', 'task'),
    allowNull: false,
    defaultValue: 'task'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium'
  },
  state: {
    type: DataTypes.ENUM('backlog', 'in_progress', 'review', 'done', 'closed'),
    allowNull: false,
    defaultValue: 'backlog'
  }
});

// Model per a la taula Usuaris
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});


// hook per encriptar la contrasenya abans de desar un nou usuari
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10); // Encripta la contrasenya amb bcrypt
  user.password = hashedPassword;
});



// Model per a la taula Comentaris
const Comment = sequelize.define('Comment', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: {
    type: DataTypes.STRING
  }
});



// Definim les relacions
Project.hasMany(Issue, { onDelete: 'CASCADE', hooks: true }); // Un projecte pot tenir diversos issues
Issue.belongsTo(Project); // Un issue pertany a un únic projecte

Issue.belongsTo(User); // Un issue té un usuari assignat
User.hasMany(Issue); 

Issue.hasMany(Comment, { onDelete: 'CASCADE', hooks: true }); // Un issue pot tenir diversos comentaris
Comment.belongsTo(Issue); // Un comentari pertany a un únic issue

User.hasMany(Comment); // Un usuari pot crear molts comentaris
Comment.belongsTo(User); // Un comentari pertany a un únic usuari



// connectem a base de dades 
async function iniDB() {
  await sequelize.sync({ force: true });
}

//iniDB();

//Exportem els models
module.exports = {
  Project,
  Issue,
  User,
  Comment,
  sequelize // Per si vols utilitzar la instància de Sequelize per a altres operacions
};

const express = require('express'); // Importa la llibreria Express per gestionar les rutes
const router = express.Router(); // Crea un router d'Express
const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes
const jwt = require('jsonwebtoken'); // Importa la llibreria jsonwebtoken per a generar i verificar JWT

const SECRET_KEY = "vols-que-et-punxi-amb-un-punxo";

const { Project,
  Issue,
  User,
  Comment,
  sequelize } = require('./models'); // Importa els models de dades

const {
  createItem,
  updateItem,
  deleteItem,
  readItem,
  readItems,
  readItemForUser,
  readItemsForUser,
  deleteItemForUser
} = require('./generics'); // Importa les funcions per a realitzar operacions CRUD genèriques



// AUTENTICACIO


// Middleware per verificar el JWT en la cookie
const checkToken = (req, res, next) => {
  const token = req.cookies?.token; // Obté el token des de la cookie de la petició
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' }); // Retorna error 401 si no hi ha cap token
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY); // Verifica el token utilitzant la clau secreta
    req.userId = decodedToken.userId; // Estableix l'ID d'usuari a l'objecte de la petició
    next(); // Passa al següent middleware
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' }); // Retorna error 401 si el token és invàlid
  }
};


// banners: https://manytools.org/hacker-tools/ascii-banner/

/*
██╗   ██╗    ███████╗    ███████╗    ██████╗     ███████╗
██║   ██║    ██╔════╝    ██╔════╝    ██╔══██╗    ██╔════╝
██║   ██║    ███████╗    █████╗      ██████╔╝    ███████╗
██║   ██║    ╚════██║    ██╔══╝      ██╔══██╗    ╚════██║
╚██████╔╝    ███████║    ███████╗    ██║  ██║    ███████║
 ╚═════╝     ╚══════╝    ╚══════╝    ╚═╝  ╚═╝    ╚══════╝                                  
*/

// Operacions CRUD per als Usuaris
router.get('/users', async (req, res) => await readItems(req, res, User)); // Llegeix tots els usuaris
router.get('/users/:id', async (req, res) => await readItem(req, res, User)); // Llegeix un usuari específic
// router.put('/users/:id', async (req, res) => await updateItem(req, res, User)); // Actualitza un usuari
router.delete('/users/:id', async (req, res) => await deleteItem(req, res, User)); // Elimina un usuari


// LOGIN I REGISTRE

// Endpoint per iniciar sessió d'un usuari
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Obté l'email i la contrasenya de la petició
  try {
    const user = await User.findOne({ where: { email } }); // Cerca l'usuari pel seu email
    if (!user) {
      return res.status(404).json({ error: 'User no trobat' }); // Retorna error 404 si l'usuari no es troba
    }
    const passwordMatch = await bcrypt.compare(password, user.password); // Compara la contrasenya proporcionada amb la contrasenya encriptada de l'usuari
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password incorrecte' }); // Retorna error 401 si la contrasenya és incorrecta
    }
    const token = jwt.sign({ userId: user.id, userName: user.name }, SECRET_KEY, { expiresIn: '2h' }); // Genera un token JWT vàlid durant 2 hores
    res.cookie('token', token, { httpOnly: false, maxAge: 7200000 }); // Estableix el token com una cookie
    res.json({ name: user.name, id: user.id }); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

router.get('/refresh', checkToken, async (req, res) => {

  const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu email
  if (!user) {
    return res.status(404).json({ error: 'User no trobat' }); // Retorna error 404 si l'usuari no es troba
  }
  return res.json({id: user.id, name: user.name})
})

// Endpoint per registrar un usuari
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body; // Obté el nom, email i contrasenya de la petició
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, i password requerits' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    const existingUser = await User.findOne({ where: { email } }); // Comprova si l'email ja està registrat
    if (existingUser) {
      return res.status(400).json({ error: 'Email ja existeix' }); // Retorna error 400 si l'email ja està registrat
    }
    const user = await User.create({ name, email, password }); // Crea l'usuari amb les dades proporcionades

    res.status(201).json({id: user.id, name: user.name, email: user.email}); // Retorna l'usuari creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});



/*
██████╗     ██████╗      ██████╗          ██╗    ███████╗     ██████╗    ████████╗    ███████╗
██╔══██╗    ██╔══██╗    ██╔═══██╗         ██║    ██╔════╝    ██╔════╝    ╚══██╔══╝    ██╔════╝
██████╔╝    ██████╔╝    ██║   ██║         ██║    █████╗      ██║            ██║       ███████╗
██╔═══╝     ██╔══██╗    ██║   ██║    ██   ██║    ██╔══╝      ██║            ██║       ╚════██║
██║         ██║  ██║    ╚██████╔╝    ╚█████╔╝    ███████╗    ╚██████╗       ██║       ███████║
╚═╝         ╚═╝  ╚═╝     ╚═════╝      ╚════╝     ╚══════╝     ╚═════╝       ╚═╝       ╚══════╝                                                                                                                                      
*/

// Operacions CRUD per als Projects

router.post('/projects', checkToken, async (req, res) => await createItem(req, res, Project)); // Llegeix tots els projectes
router.get('/projects',  checkToken, async (req, res) => await readItems(req, res, Project)); // Llegeix tots els projectes
router.get('/projects/:id', async (req, res) => await readItem(req, res, Project)); // Llegeix un Project específic
//router.put('/projects/:id', async (req, res) => await updateItem(req, res, Project)); // Actualitza un Project

// Elimina un Project, issues i comments relacionats s'haurien d'eliminar en cascada tal com descriu el model
router.delete('/projects/:id', async (req, res) => await deleteItem(req, res, Project));

router.get('/projectsx',  async (req, res) => {
    const projectes = await Project.findAll({include: {model: Issue, include: Comment}})
    res.json(projectes)

}); // Llegeix tots els projectes

// GET per retornar els issues d'un projecte
router.get('/project/:project_id/issues', checkToken, async (req, res) => {
  try {
    const projecte = await Project.findByPk(req.params.project_id, {include: Issue}); // Cerca el projecte pel seu ID
    if (!projecte) {
      return res.status(404).json({ error: 'Projecte no trobat' }); // Retorna error 404 si el projecte no es troba
    }
    res.json(projecte); // Retorna el projecte amb els issues
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});


/*
██╗    ███████╗    ███████╗    ██╗   ██╗    ███████╗    ███████╗
██║    ██╔════╝    ██╔════╝    ██║   ██║    ██╔════╝    ██╔════╝
██║    ███████╗    ███████╗    ██║   ██║    █████╗      ███████╗
██║    ╚════██║    ╚════██║    ██║   ██║    ██╔══╝      ╚════██║
██║    ███████║    ███████║    ╚██████╔╝    ███████╗    ███████║
╚═╝    ╚══════╝    ╚══════╝     ╚═════╝     ╚══════╝    ╚══════╝
*/


// Operacions CRUD per als Issues
router.get('/issues/:id', async (req, res) => await readItem(req, res, Issue)); // Llegeix una issue específica
router.delete('/issues/:id', async (req, res) => await deleteItem(req, res, Issue)); // Elimina una issue

// POST per crear una issue per un projecte
router.post('/issues/project/:project_id', checkToken, async (req, res) => {
  try {
    const projecte = await Project.findByPk(req.params.project_id); // Cerca el projecte pel seu ID
    if (!projecte) {
      return res.status(404).json({ error: 'Projecte no trobat' }); // Retorna error 404 si el projecte no es troba
    }
    const item = await projecte.createIssue(req.body); // Crea issue per al projecte indicat
    res.status(201).json(item); // Retorna el issue creat amb el codi d'estat 201
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});


// Endpoint per vincular una issue a un usuari
router.post('/issues/:id_issue/users/:id_user', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id_user);
    const issue = await Issue.findByPk(req.params.id_issue);
    if (!user || !issue) {
      return res.status(404).json({ error: 'Issue o User no trobats' });
    }
    await user.addIssue(issue);
    res.json({ message: 'Issue actualitzat' }); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});


// Endpoint per modificar un issue
router.patch('/issues/:id_issue', async (req, res) => {

  try {
    const existingIssue = await Issue.findByPk(req.params.id_issue);

    if (!existingIssue) {
      return res.status(404).json({ error: "No s'ha trobat cap issue amb aquest ID" });
    }

    // Actualitzem només les propietats que es reben al body
    if (req.body.title) {
      existingIssue.title = req.body.title;
    }
    if (req.body.desc) {
      existingIssue.desc = req.body.desc;
    }
    if (req.body.type) {
      existingIssue.type = req.body.type;
    }
    if (req.body.priority) {
      existingIssue.priority = req.body.priority;
    }
    if (req.body.state) {
      existingIssue.state = req.body.state;
    }

    // Guardem els canvis
    await existingIssue.save();

    return res.status(200).json({ message: 'Issue actualitzada' });
  } catch (error) {
    return res.status(500).json({ error: `Error actualitzant la issue "{id_issue}` });
  }
});

/*
 ██████╗     ██████╗     ███╗   ███╗    ███╗   ███╗    ███████╗    ███╗   ██╗    ████████╗    ███████╗
██╔════╝    ██╔═══██╗    ████╗ ████║    ████╗ ████║    ██╔════╝    ████╗  ██║    ╚══██╔══╝    ██╔════╝
██║         ██║   ██║    ██╔████╔██║    ██╔████╔██║    █████╗      ██╔██╗ ██║       ██║       ███████╗
██║         ██║   ██║    ██║╚██╔╝██║    ██║╚██╔╝██║    ██╔══╝      ██║╚██╗██║       ██║       ╚════██║
╚██████╗    ╚██████╔╝    ██║ ╚═╝ ██║    ██║ ╚═╝ ██║    ███████╗    ██║ ╚████║       ██║       ███████║
 ╚═════╝     ╚═════╝     ╚═╝     ╚═╝    ╚═╝     ╚═╝    ╚══════╝    ╚═╝  ╚═══╝       ╚═╝       ╚══════╝                                                                                                
*/



// Operacions CRUD per als comments
router.get('/comments/:id', async (req, res) => await readItem(req, res, Issue)); // Llegeix una issue específica
router.delete('/comments/:id', async (req, res) => await deleteItem(req, res, Issue)); // Elimina una issue


// GET per retornar els comments d'un issue
router.get('/comments/issue/:issue_id', async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.issue_id); // Cerca el issuee pel seu ID
    if (!issue) {
      return res.status(404).json({ error: 'issue no trobat' }); // Retorna error 404 si el issue no es troba
    }
    const comments = await issue.getComments(); // Obté totes els comments del issue
    res.json(comments); // Retorna les comments
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

// POST per crear un comment per un issue
router.post('/comments/issue/:issue_id', async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.issue_id); // Cerca el issue pel seu ID
    if (!issue) {
      return res.status(404).json({ error: 'issue no trobat' }); // Retorna error 404 si el issue no es troba
    }
    const item = await issue.createComment(req.body); // Crea comment per al issue indicat
    res.status(201).json(item); // Retorna el comment creat amb el codi d'estat 201
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});




module.exports = router; // Exporta el router amb les rutes definides

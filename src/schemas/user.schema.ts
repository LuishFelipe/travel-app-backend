/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         nickname:
 *           type: string
 *         username:
 *           type: string
 *           description: Nome de usuário único
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         photoProfile:
 *           type: string
 *           nullable: true
 *           description: URL da foto de perfil
 *         description:
 *           type: string
 *           nullable: true
 *         privacity:
 *           type: boolean
 *           description: Define se o perfil é privado
 *           default: false
 *       example:
 *         id: "507f1f77bcf86cd799439011"
 *         nickname: "João"
 *         username: "joaosilva"
 *         email: "joao.silva@email.com"
 *         phone: "+5511999999999"
 *         photoProfile: "https://example.com/foto.jpg"
 *         description: "Desenvolvedor backend"
 *         privacity: false
 *
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - nickname
 *         - username
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         nickname:
 *           type: string
 *         username:
 *           type: string
 *           description: Nome de usuário único
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         phone:
 *           type: string
 *         photoProfile:
 *           type: string
 *           nullable: true
 *           description: URL da foto de perfil
 *         description:
 *           type: string
 *           nullable: true
 *         privacity:
 *           type: boolean
 *           default: false
 *       example:
 *         nickname: "João"
 *         username: "joaosilva"
 *         email: "joao.silva@email.com"
 *         password: "123456"
 *         phone: "+5511999999999"
 *         photoProfile: "https://example.com/foto.jpg"
 *         description: "Desenvolvedor backend"
 *         privacity: false
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *         username:
 *           type: string
 *           description: Nome de usuário único
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         phone:
 *           type: string
 *         photoProfile:
 *           type: string
 *           nullable: true
 *           description: URL da foto de perfil
 *         description:
 *           type: string
 *           nullable: true
 *         privacity:
 *           type: boolean
 *       example:
 *         nickname: "João Silva"
 *         username: "joaosilva123"
 *         email: "joaosilva123@email.com"
 *         password: "novaSenha123"
 *         phone: "+5511988888888"
 *         photoProfile: "https://example.com/fotoNova.jpg"
 *         description: "Desenvolvedor fullstack"
 *         privacity: true
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

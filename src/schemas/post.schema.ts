/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 *         privacity:
 *           type: boolean
 *         likeNumber:
 *           type: integer
 *         userId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PostComponentInput:
 *       type: object
 *       required: [order, type, content]
 *       properties:
 *         order:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [TEXT, PHOTO, VIDEO]
 *         content:
 *           type: object
 *           description: Conteúdo específico do tipo de componente
 *           oneOf:
 *             - $ref: '#/components/schemas/TextContent'
 *             - $ref: '#/components/schemas/PhotoContent'
 *             - $ref: '#/components/schemas/VideoContent'
 *
 *     TextContent:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *
 *     PhotoContent:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: uri
 *         caption:
 *           type: string
 *
 *     VideoContent:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: uri
 *         duration:
 *           type: integer
 *
 *     CreatePostRequest:
 *       type: object
 *       required: [description, privacity, components]
 *       properties:
 *         description:
 *           type: string
 *         privacity:
 *           type: boolean
 *         components:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostComponentInput'
 *
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         privacity:
 *           type: boolean
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post com componentes
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 *   get:
 *     summary: Lista todos os posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *
 * /posts/{id}:
 *   get:
 *     summary: Busca um post por ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post não encontrado
 *
 *   put:
 *     summary: Atualiza um post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       200:
 *         description: Post atualizado
 *
 *   delete:
 *     summary: Remove um post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Post removido com sucesso
 */

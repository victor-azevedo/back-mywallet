import { handleRequestError } from "../errors/index.js";
import { authService } from "../services/auth-service.js";

async function registerUser(req, res) {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Route for register user.'
    #swagger.parameters['obj'] = {
      in: 'body',
      name: 'Register',
      description: 'Data for register user',
      required: true,
      schema: {
        $ref: '#/definitions/registerSchemaSwagger',
      },
    },   
  */

  const userToRegister = req.body;

  try {
    await authService.registerUser(userToRegister);
    return res.sendStatus(201);
  } catch (error) {
    handleRequestError(res, error);
  }
}

async function login(req, res) {
  /*
    #swagger.tags = ['Sessions']
    #swagger.description = 'Route for user login.'   
    #swagger.parameters['obj'] = {
      in: 'body',
      name: 'Login',
      description: 'User entry for login',
      required: true,
      schema: {
        $ref: '#/definitions/loginSchemaSwagger',
      },
    },
  */
  const userToLogin = req.body;

  try {
    const token = await authService.login(userToLogin);
    return res.status(201).send({ token });
  } catch (error) {
    handleRequestError(res, error);
  }
}

export const authController = {
  registerUser,
  login,
};

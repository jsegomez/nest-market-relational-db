import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      user: process.env.USER_DB,
      host: process.env.HOST_DB,
      database: process.env.MODEL_DB,
      password: process.env.PASSWORD_DB,
      port: parseInt(process.env.PORT_DB, 10),
    },
  };
});

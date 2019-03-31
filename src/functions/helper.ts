const getEnv = (name: string) => {
  if (!name || !process.env[name]) {
    console.log(`process.env.${name} NOT EXIST`);
    return '';
  }
  return process.env[name];
};

const localGlobal = (window || global) as any;
localGlobal.getEnv = getEnv;

export {
  getEnv,
};

const getEnv = (name: string) => {
  if (!name || !process.env[name]) {
    console.log(`process.env.${name} NOT EXIST`)
    return ''
  }
  return process.env[name]
}

const _global = (window || global) as any;
_global.getEnv = getEnv

export {
  getEnv,
}
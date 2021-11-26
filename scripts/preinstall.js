// 必须使用PNPM作为包管理器来安装依赖
// process.env.npm_execpath指包管理器的执行路径
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository requires using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  )
  process.exit(1)
}

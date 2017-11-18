import { render, flattenBranch, imposeTok, exposeConn, imposeConnection, calTok } from './pass'
import { transNode } from './struct'

const run = (tok, passes) => {
  return passes.reduce((t, pass) => pass(t), tok)
}

export const driver = (tok) => {
  return run(tok, [
    imposeTok,
    transNode,
    calTok,
    imposeConnection,
    flattenBranch,
    exposeConn,
    render,
  ])
}
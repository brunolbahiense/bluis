// Roda os testes unitários e grava os números reais do build em src/generated/build-info.json.
// Se algum teste falhar, o build para aqui — o site nunca publica com testes quebrados.
import { execFileSync, execSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const reportPath = join(process.cwd(), '.vitest-report.json')
const outputPath = join(process.cwd(), 'src', 'generated', 'build-info.json')

try {
  execFileSync(
    'yarn',
    [
      'vitest',
      'run',
      '--reporter=default',
      '--reporter=json',
      `--outputFile.json=${reportPath}`
    ],
    { stdio: 'inherit' }
  )
} catch {
  console.error('\nTestes falharam — build interrompido.')
  process.exit(1)
}

let report
try {
  report = JSON.parse(readFileSync(reportPath, 'utf8'))
  rmSync(reportPath)
} catch {
  console.error('\nRelatório do Vitest não encontrado — build interrompido.')
  process.exit(1)
}

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8')
)

function currentCommit() {
  if (process.env.VERCEL_GIT_COMMIT_SHA)
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'local'
  }
}

const buildInfo = {
  version: packageJson.version,
  commit: currentCommit(),
  builtAt: new Date().toISOString(),
  tests: { passed: report.numPassedTests, total: report.numTotalTests }
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(buildInfo, null, 2)}\n`)
console.log(
  `build-info: v${buildInfo.version} · ${buildInfo.commit} · ${buildInfo.tests.passed}/${buildInfo.tests.total} testes`
)

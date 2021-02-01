import { chalk, yParser, semver } from '@umijs/utils';
import program from 'commander';
import { Service } from './serviceWithBuiltIn';
import fork from './utils/fork';
import getCwd from './utils/getCwd';
import getPkg from './utils/getPkg';
import fesPkg from '../package.json';

const requiredVersion = fesPkg.engines.node;

function checkNodeVersion(wanted, id) {
    if (
        !semver.satisfies(process.version, wanted, { includePrerelease: true })
    ) {
        console.log(
            chalk.red(
                `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`
            )
        );
        process.exit(1);
    }
}

checkNodeVersion(requiredVersion, '@webank/fes');

// process.argv: [node, fes.js, command, args]
const args = yParser(process.argv.slice(2));

program
    .version(`@webank/fes ${fesPkg.version}`, '-v, --vers', 'output the current version')
    .usage('<command> [options]')
    .description(fesPkg.description);

program
    .command('dev')
    .description('run local http service for development')
    .action(() => {
        try {
            const child = fork({
                scriptPath: require.resolve('./forkedDev')
            });
            // ref:
            // http://nodejs.cn/api/process/signal_events.html
            process.on('SIGINT', () => {
                child.kill('SIGINT');
                process.exit(1);
            });
            process.on('SIGTERM', () => {
                child.kill('SIGTERM');
                process.exit(1);
            });
        } catch (e) {
            console.error(chalk.red(e.message));
            console.error(e.stack);
            process.exit(1);
        }
    });

program
    .command('build')
    .description('compile and package code')
    .action(async () => {
        try {
            process.env.NODE_ENV = 'production';
            await new Service({
                cwd: getCwd(),
                pkg: getPkg(process.cwd())
            }).run({
                name: 'build',
                args
            });
        } catch (e) {
            console.error(chalk.red(e.message));
            console.error(e.stack);
            process.exit(1);
        }
    });

program
    .command('info')
    .description('print debugging information about your environment')
    .action(() => {
        console.log(chalk.bold('\nEnvironment Info:'));
        require('envinfo')
            .run(
                {
                    System: ['OS', 'CPU'],
                    Binaries: ['Node', 'Yarn', 'npm'],
                    Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
                    npmPackages: '/**/{typescript,*vue*,@webank/*/}',
                    npmGlobalPackages: ['@webank/fes']
                },
                {
                    showNotFound: true,
                    duplicates: true,
                    fullTree: true
                }
            )
            .then(console.log);
    });

program
    .arguments('[command]')
    .option('--debug', 'Skip prompts and use default preset')
    .action(async (cmd) => {
        if (cmd) {
            try {
                await new Service({
                    cwd: getCwd(),
                    pkg: getPkg(process.cwd())
                }).run({
                    name: cmd,
                    args
                });
            } catch (e) {
                console.error(chalk.red(e.message));
                console.error(e.stack);
                process.exit(1);
            }
        }
    });

program.on('--help', () => {
    console.log();
    console.log(
        `  Run ${chalk.cyan(
            'fes <command> --help'
        )} for detailed usage of given command.`
    );
    console.log();
});

program.commands.forEach(c => c.on('--help', () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

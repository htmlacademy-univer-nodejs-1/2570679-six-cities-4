import { Command } from './command.interface.js';
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.bold.cyan('\nПрограмма для подготовки данных для REST API сервера\n'));

    chalkAnimation.rainbow('cli.js --<command> [--arguments]').render();

    console.info(`\n${chalk.bold('Команды:')}\n`);
    console.info(`  ${chalk.green('--version:')}        ${chalk.gray('# выводит номер версии')}`);
    console.info(`  ${chalk.green('--help:')}           ${chalk.gray('# печатает этот текст')}`);
    console.info(`  ${chalk.green('--import <path>:')}  ${chalk.gray('# импортирует данные из TSV')}\n`);
  }
}

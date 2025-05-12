#!/usr/bin/env node
import { GenerateCommand } from './cli/commands/generate.command.js';
import { CLIApplication, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';
import process from 'node:process';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();

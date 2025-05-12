import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/file-reader/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      for await (const offer of fileReader.read()) {
        console.log(offer);
      }
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${err.message}`);
    }
  }
}

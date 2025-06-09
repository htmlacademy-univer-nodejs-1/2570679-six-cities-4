import { FileReader } from './file-reader.interface.js';
import { createReadStream } from 'node:fs';
import { createOffer } from '../../helpers/create-offer.js';
import { RentalOffer } from '../../types/offer.type.js';
import { createInterface } from 'node:readline';

export class TSVFileReader implements FileReader<RentalOffer> {
  constructor(
    private readonly filename: string
  ) {}

  public async *read(): AsyncIterable<RentalOffer> {
    const stream = createReadStream(this.filename, { encoding: 'utf-8' });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });

    try {
      for await (const line of rl) {
        if (!line.trim()) {
          continue;
        }

        yield createOffer(line);
      }
    } finally {
      rl.close();
    }
  }
}

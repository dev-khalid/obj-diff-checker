import { Injectable } from '@nestjs/common';
import { flatten } from 'flatnest';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { differenceWith } from 'lodash';
import { join } from 'path';
import * as obj2 from './data/current-swagger-example.json';
import * as obj1 from './data/sandbox-input.json';
@Injectable()
export class AppService {
  constructor() {
    //Test data
    // let obj1 = {
    //   a: {
    //     id: 1,
    //   },
    //   b: {
    //     name: 'John',
    //     age: 40
    //   },
    //   c: {
    //     address: '123 Main St',
    //   },
    // };

    //Test data
    // let obj2 = {
    //   a: {
    //     id: 1,
    //   },
    //   b: {
    //     name: 'John',
    //     email: 'john@gmail.com',
    //   },
    // };

    this.outputToFile('to-add-properties.json', {
      reportTitle:
        'Properties that is present in Sandbox but not in current-swagger-example: ',
      actionItem: 'Include this properties in DTO',
      missingProperties: this.checkDiffByProperties(obj1, obj2),
    });
    this.outputToFile('to-remove-properties.json', {
      reportTitle:
        'Properties that is present in current-swagger-example but not in Sandbox: ',
      actionItem: 'Remove these properties from DTO.',
      extraProperties: this.checkDiffByProperties(obj2, obj1),
    });
  }
  outputToFile(filename: string, output: unknown) {
    // Construct the directory path
    const outputDir = join(__dirname, '../output');

    // Ensure the directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true }); // Create the directory and parent directories if necessary
    }

    // Write the file
    writeFileSync(join(outputDir, filename), JSON.stringify(output, null, 2));

    console.log(`Output file ${filename} has been created.`);
  }

  checkDiffByProperties(obj1: Object, obj2: Object) {
    const keys1 = Object.keys(flatten(obj1));
    const keys2 = Object.keys(flatten(obj2));
    return differenceWith(keys1, keys2);
  }

  getHello(): string {
    return 'Hello World!';
  }
}

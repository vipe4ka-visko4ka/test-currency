import { Injectable } from '@nestjs/common';

@Injectable()
export class FileParserService {
  public parseFile(fileContent: string) {
    const lines = fileContent.split('\n').filter((line) => line.trim() !== '');

    const stage1 = lines.map((line, index) => {
      const spacesAmount = line.length - line.trimStart().length;

      let lineType: string | null = null;

      if (spacesAmount === 0) {
        lineType = 'array-declarator';
      } else if (line.includes('=')) {
        lineType = 'field';
      } else if (!lines[index + 1].includes('=')) {
        lineType = 'array-declarator';
      } else {
        lineType = 'array-item';
      }

      return { line, lineType, spacesAmount, level: spacesAmount / 2 };
    });

    const result = {};

    let lastArray = null;
    let lastObject = null;
    let previousLevel = 0;
    const previousArrays = [];
    const previousObjects = [];

    stage1.forEach((line) => {
      if (previousLevel > line.level && line.lineType === 'array-item') {
        for (let i = previousArrays.length - 1; i >= 0; i--) {
          if (previousArrays[i].line.level < line.level) {
            lastArray = previousArrays[i].array;
            break;
          }
        }
      }

      if (previousLevel > line.level && line.lineType === 'array-declarator') {
        for (let i = previousObjects.length - 1; i >= 0; i--) {
          if (previousObjects[i].line.level < line.level) {
            lastObject = previousObjects[i].object;
            break;
          }
        }
      }

      if (line.lineType === 'array-declarator' && line.level === 0) {
        lastArray = [];
        result[line.line] = lastArray;
        previousArrays.push({ line, array: lastArray });
      } else if (line.lineType === 'array-declarator') {
        lastArray = [];
        lastObject[line.line.trim()] = lastArray;
        previousArrays.push({ line, array: lastArray });
      } else if (line.lineType === 'array-item') {
        lastObject = {};
        lastArray.push(lastObject);
        previousObjects.push({ line, object: lastObject });
      } else if (line.lineType === 'field') {
        const [key, value] = line.line.split('=');
        const [keyTrimmed, valueTrimmed] = [key.trim(), value.trim()];
        lastObject[keyTrimmed] = this.parseFieldValue(valueTrimmed);
      }

      previousLevel = line.level;
    });

    return result;
  }

  private parseFieldValue(fieldValue: string): string | number | Date {
    const numberValue = Number(fieldValue);
    if (!isNaN(numberValue)) return numberValue;

    return fieldValue;
  }
}

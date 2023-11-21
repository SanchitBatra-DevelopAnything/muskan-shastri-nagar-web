import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonParse'
})
export class JsonParsePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    return JSON.parse(value);
  }

}

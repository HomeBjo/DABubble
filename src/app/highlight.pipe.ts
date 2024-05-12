import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  /**
   * Transforms the input text by highlighting matches of the search query.
   * @param wholeText The entire text where matches will be highlighted.
   * @param inputValue The search query to highlight.
   * @returns The transformed text with highlighted matches.
   */
  transform(wholeText: string, inputValue: string): string {
    if (!inputValue) {
      return wholeText;
    }
    const escapedInputValue = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escapedInputValue, 'gi');
    return wholeText.replace(re, '<mark>$&</mark>');
  }
}

export class ListPrinter {
  public static print(list: string[]): string {
    if (list.length >= 3) {
      return list
        .slice(0, list.length - 1)
        .join(', ')
        + ', and ' 
        + list[list.length - 1];
    } else {
      return list.join(' and ');
    }
  }
}
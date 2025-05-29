export class StaticDomainApi {
  private static apiUrl = '';

  public static configure(apiUrl?: string) {
    this.apiUrl = apiUrl || 'http://localhost:5001/api';
  }

  public static getUrl(): string {
    return StaticDomainApi.apiUrl;
  }
}

/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes
    public server = "https://";
    public baseAttachmentUrl = "https://";

    public baseBackendApplicationUri = "gmbackend";
    public baseApiUri = "api";

    public webDavUsername = "YOUR_USERNAME";
    public webDavPassword = "YOUR_PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseBackendApplicationUri + "/" + this.baseApiUri;
    }
}
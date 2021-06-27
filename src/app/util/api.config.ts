/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://management";
    public baseAttachmentUrl = "https://management";

    public baseApiUri = "api";

    //CHANGE THIS
    public webDavUsername = "YOUR_USERNAME";
    public webDavPassword = "YOUR_PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://BACKEND-SERVER";
    public baseAttachmentUrl = "https://WEBDAV-CLOUD-URL";

    public baseApiUri = "api";

    //CHANGE
    public webDavUsername = "WEBDAV-USERNAME";
    public webDavPassword = "WEBDAV-PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
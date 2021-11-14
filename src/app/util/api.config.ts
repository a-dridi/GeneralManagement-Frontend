/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://BACKEND-SPRING-SERVER";
    public baseAttachmentUrl = "https://WEBDAV-NEXTCLOUD-APP";

    public baseApiUri = "api";

    //CHANGE
    public webDavUsername = "USERNAME";
    public webDavPassword = "PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
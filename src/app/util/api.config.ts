/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://BACKEND_API_SERVER";
    public baseAttachmentUrl = "https://WEB_DAV/dav/files/username";

    public baseApiUri = "api";

    //CHANGE THIS
    public webDavUsername = "USERNAME";
    public webDavPassword = "PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
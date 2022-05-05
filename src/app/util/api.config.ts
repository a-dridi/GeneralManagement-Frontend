/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://YOUR-BACKEND-SERVER";
    public baseAttachmentUrl = "https://YOUR-WEBDAV-SERVER-OR-CLOUD/remote.php/dav/files";

    public baseApiUri = "api";

    //CHANGE THIS
    public webDavUsername = "WEBDAV_USERNAME";
    public webDavPassword = "WEBDAV_PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
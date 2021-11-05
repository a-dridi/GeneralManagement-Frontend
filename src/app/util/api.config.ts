/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://BACKEND-SERVER";
    public baseAttachmentUrl = "https://webdav-nextcloud/remote.php/dav/files/webdav";

    public baseApiUri = "api";

    //CHANGE
    public webDavUsername = "WEBDAV_USERNAME";
    public webDavPassword = "WEBDAV_PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
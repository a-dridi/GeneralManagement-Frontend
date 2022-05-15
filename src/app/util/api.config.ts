/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://YOUR_BACKEND_SERVER";
    public baseAttachmentUrl = "https://YOUR_WEBDAV_CLOUD_URL/remote.php/dav/files/";

    public baseApiUri = "api";

    //CHANGE THIS
    public webDavUsername = "WEBDAV_USERNAME";
    public webDavPassword = "WEBDAV_PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
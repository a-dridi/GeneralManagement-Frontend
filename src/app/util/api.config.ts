/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THIS - Add no tailing or leading slashes - Also Change dataGroups - urls variable in File: "ngsw-config.json"
    public server = "https://API_SERVER";
    public baseAttachmentUrl = "https://NEXTCLOUD_DEV_URL";

    public baseApiUri = "api";

    //CHANGE
    public webDavUsername = "WEBDEV_USER";
    public webDavPassword = "WEBDAV_PASS";

    get apiUrl(): string {
        return this.server + "/" + this.baseApiUri;
    }
}
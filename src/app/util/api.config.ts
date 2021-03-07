/*
Saves the API access settings
*/
export class ApiConfig {

    //CHANGE THESE - Add no tailing or leading slashes
    public server = "SERVER";
    public baseAttachmentUrl = "SERVER_WEBDAV_ATTACHMENT_URL";

    public baseBackendApplicationUri = "gmbackend";
    public baseApiUri = "api";

    public webDavUsername = "WEBDAV_USERNAME";
    public webDavPassword = "WEBDAV_PASSWORD";

    get apiUrl(): string {
        return this.server + "/" + this.baseBackendApplicationUri + "/" + this.baseApiUri;
    }
}
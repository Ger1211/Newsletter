const fs = require('fs');
const {google} = require('googleapis');


class GMailAPIClient {

    constructor(credentials_path='./credentials.json', token_path='./token.json') {
        if (!fs.existsSync(credentials_path)) {
            throw new Error(`Credentials file not found: ${credentials_path}`);
        }
        if (!fs.existsSync(token_path)) {
            throw new Error(`Token file not found: ${token_path}`);
        }
        this.credentials_file = credentials_path;
        this.token_file = token_path;
        this._client = this._buildGmailClient()
    }

    send_mail(subject, bodyLines, receiver, sender) {
        return this._client.users.messages.send(
            {
              userId: 'me',
              requestBody: {
                raw: this._createMessage(subject, bodyLines, receiver, sender),
              },
            }
          );
    }
      
    _createMessage(subject, bodyLines, receiver, sender) {
        // You can use UTF-8 encoding for the subject using the method below.
        // You can also just use a plain string if you don't need anything fancy.
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        let messageParts = [
        `From: ${sender.name} <${sender.email}>`,
        `To: ${receiver.name} <${receiver.email}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        ];
        messageParts = messageParts.concat(bodyLines)
        const message = messageParts.join('\n');
    
        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    
        return encodedMessage;
    }


    _buildGmailClient() {
        const credentials = fs.readFileSync(this.credentials_file);
        const token = fs.readFileSync(this.token_file)
        const oauthClient = this._buildOAuthClient(this._makeCredentials(credentials, token));

        return google.gmail({version: 'v1', auth: oauthClient});
    }

    _makeCredentials(credentials, token) {
        return {
            params: JSON.parse(credentials).installed,
            token: JSON.parse(token),
        };
    }

    _buildOAuthClient(credentials) {
        const oAuth2Client = new google.auth.OAuth2(
            credentials.params.client_id,
            credentials.params.client_secret,
            credentials.params.redirect_uris[0]
        );
        oAuth2Client.setCredentials(credentials.token);
        return oAuth2Client;
    }
}


module.exports = GMailAPIClient;
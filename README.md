oauth2-dialog
==============
Provides a easy way to perform OAuth2 implicit flow authentication and get a access token

Can be used as a node module or as a standalone tool. 
Also supports listening for authentication requests over HTTP or performing requests against a server. 
This enables usage when you have no GUI, by delegating to your actual workstation. 
When using SSH, a tunnel can be opened on the remote machine that leads to your workstation that runs
oauth2-dialog in server, and by setting the OAUTH2_CONNECT environment variable to localhost[:port] the
tool will delegate all requests to the workstation

This tool was created to make debugging API's easier.
Do not use this to perform secure authentication, no warranties are given for the security or stability of this module.
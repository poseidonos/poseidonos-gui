/*-------------------------------------------------------------------------------------*/
/*                                                                                     */
/*               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      */
/*                          ALL RIGHTS RESERVED                                        */
/*                                                                                     */
/*   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        */
/*   products to use or abstract this computer program for the sole purpose of         */
/*   implementing a product based on Samsung Electronics Co., Ltd. products.           */
/*   No other rights to reproduce, use, or disseminate this computer program,          */
/*   whether in part or in whole, are granted.                                         */
/*                                                                                     */
/*   Samsung Electronics Co., Ltd. makes no representation or warranties with          */
/*   respect to the performance of this computer program, and specifically disclaims   */
/*   any responsibility for any damages, special or consequential, connected           */
/*   with the use of this program.                                                     */
/*                                                                                     */
/*-------------------------------------------------------------------------------------*/

/****************************************************************************************
*
* DESCRIPTION: This file is used for connecting the Python Server with iBOFOS
               This file is created only because the iBOFOS was crashing after array 
               creation when the commands where send directly from Python
*
* @NAME     : socketbridge-source.cpp
* @Version    : 1.0
*
* @REVISION HISTORY
*
*   22-May-2019 [Aswin K K] : File Created
*
*****************************************************************************************/

#include<sys/socket.h>
#include<sys/un.h>
#include<unistd.h>

#include<string>
#include<iostream>

using namespace std;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function Name:               main
//
// Input Parameters:            Command to iBOFOS in string encoded JSON format
//
// Return value:                0
//
//
// Description:                 The command which is input to the function is in turn passed to iBOFOS and the return value is printed,
//                               which will be read by the Python server
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

int main(int argc, char *argv[]) {
    int sockfd = 0;
    char buf[1024];
    char rbuf[65536];
    int len;
    struct sockaddr_un server;
    strcpy(buf, argv[1]);
    sockfd = socket(AF_UNIX, SOCK_STREAM, 0);
    if(sockfd < 0) {
        cout<<"{\"error\": \"Opening stream socket\"}"<<endl;
        return 0;
    }
    server.sun_family = AF_UNIX;
    strcpy(server.sun_path, "/fa/sock");
    if (connect(sockfd, (struct sockaddr *)&server, sizeof(struct sockaddr_un)) < 0) {
        close(sockfd);
        cout<<"{\"error\": \"Connecting Stream socket\"}";
        return 0;
    }
    if (write(sockfd, buf, 1024) < 0) {
        cout <<"\"error\": \"Failed to write data to socket\"}";
        return 0;
    }
    memset(rbuf, 0, sizeof(rbuf));
    if((len = read(sockfd, rbuf, 65536)) < 0) {
        cout << "\"error\": \"Failed to read FA CLI socket data\"}";
        return 0;
    }
    cout<<rbuf;
    return 0;
}


'''
/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 '''
 
import socket

def get_ip_address():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except socket.error:
        return None

ip = get_ip_address()
f = open("virtual.conf",'w+')
"""
server {
    listen       80;
    server_name  server_ip;

    location / {
        proxy_pass http://0.0.0.0:5000;
    }

    location /api {
        proxy_pass http://0.0.0.0:3000;
    }

    location /api/v1.0 {
        proxy_pass http://0.0.0.0:5000;
    }
}
"""
L = ["upstream mtool { \n", "     server    {}:5000 weight=50;\n".format(ip), "}\n", "upstream dagent { \n", "     server    {}:3000 weight=50;\n".format(ip), "}\n", "server { \n", "     listen    80;\n", "     server_name    {};\n".format(ip), "     proxy_read_timeout    50000;\n", "     location /api/dagent {\n", "           proxy_pass http://dagent;\n", "    }\n", "     location /api/ibofos {\n", "           proxy_pass http://dagent;\n", "    }\n","     location /api/metric {\n", "           proxy_pass http://dagent;\n", "    }\n",  "     location /redfish {\n", "           proxy_pass http://dagent;\n", "    }\n", "     location ^~ /api/v1.0 {\n", "           proxy_pass http://mtool;\n", "    }\n", "}\n" ]

for line in L:
    print(line)
    f.write(line)

f.close() 


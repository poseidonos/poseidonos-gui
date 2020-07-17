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
    server_name  107.108.221.146;

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
L = ["upstream mtool { \n", "     server    {}:5000 weight=50;\n".format(ip), "}\n", "upstream dagent { \n", "     server    {}:3000 weight=50;\n".format(ip), "}\n", "server { \n", "     listen    80;\n", "     server_name    {};\n".format(ip), "     proxy_read_timeout    50000;\n", "location / {\n", "           proxy_pass http://mtool;\n", "    }\n","     location /api/dagent {\n", "           proxy_pass http://dagent;\n", "    }\n", "     location /api/ibofos {\n", "           proxy_pass http://dagent;\n", "    }\n","     location /api/metric {\n", "           proxy_pass http://dagent;\n", "    }\n",  "     location /redfish {\n", "           proxy_pass http://dagent;\n", "    }\n", "     location ^~ /api/v1.0 {\n", "           proxy_pass http://mtool;\n", "    }\n","     location /redfish/v1/StorageServices {\n", "           proxy_pass http://mtool;\n", "    }\n", "}\n" ]

for line in L:
    print(line)
    f.write(line)

f.close() 


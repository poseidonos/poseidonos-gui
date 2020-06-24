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
}
"""
L = ["upstream backend { \n", "     server    {}:5000 weight=50;\n".format(ip), "}\n", "server { \n", "     listen    80;\n", "     server_name    {};\n".format(ip), "     proxy_read_timeout    50000;\n", "     location / {\n", "           proxy_pass http://0.0.0.0:5000;\n", "    }\n", "}\n" ]


for line in L:
    print(line)
    f.write(line)

f.close() 


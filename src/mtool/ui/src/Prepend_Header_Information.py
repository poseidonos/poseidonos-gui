import os
from pathlib import Path 
path = "E://IBOF_DEMO_MY_REPO//ibofmgmt//Code//Server"

files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if (('.txt' in file) or ('.js' in file) or ('.py' in file)):
            files.append(os.path.join(r, file))

for f in files:
    if(Path(f).name == '__init__.py'):
        continue
    if('.js' in f):
        continue
    src=open(f,"r+")
    if('.js' in f):
        firstline="""/*-------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         / 
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/
\n
DESCRIPTION: <File description> *
@NAME : """ +Path(f).name+ """\n@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
"""
    else:
        firstline = """'''\n/*-------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         / 
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/
\n
DESCRIPTION: <File description> *
@NAME : """ + Path(f).name + """
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''\n\n"""


    oline=src.readlines()
    #Here, we prepend the string we want to on first line
    oline.insert(0,firstline)
    src.close()
    #We again open the file in WRITE mode 
    src=open(f,"w+")
    src.writelines(oline)
    src.close()
    print(f)

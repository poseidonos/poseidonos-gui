# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(['rest/app.py'],
             pathex=['/home/ibof/vishal/git_m9k/m9k/mtool'],
             binaries=[],
             datas=[],
             hiddenimports=['eventlet.hubs.epolls', 'eventlet.hubs.kqueue', 'eventlet.hubs.selects', 'dns.asyncbackend', 'dns.asyncquery', 'dns.asyncresolver', 'dns.e164', 'dns.hash', 'dns.update', 'dns.version', 'dns.namedict', 'dns.tsigkeyring', 'dns.zone', 'dns.versioned', 'engineio.async_drivers.aiohttp', 'engineio.async_drivers.eventlet'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='app',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=True )

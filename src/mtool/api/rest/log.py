import logging
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    'public/log/mtool.log',
    maxBytes=1024 * 1024,
    backupCount=3)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)
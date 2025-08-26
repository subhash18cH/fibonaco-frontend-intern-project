"""
Database Config and Tables for Intern Project
Author: Dhaval Shrishrimal

IMPORTANT: DO NOT CHANGE OR EDIT THIS FILE.
"""

# External Imports
from sqlalchemy import event
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import (
    AsyncAttrs, async_sessionmaker, create_async_engine
)

# Database Connection Points
LINK: str = 'sqlite+aiosqlite:///../project.db'

class Base(AsyncAttrs, DeclarativeBase):
    """
    Base class for SQLAlchemy connected models with async support.
    """
    pass

engine = create_async_engine(url=LINK, echo=False, connect_args={ 'timeout': 30 })

@event.listens_for(engine.sync_engine, 'connect')
def _set_sync_pragmas(conn, record):
    """Set SQLite pragmas for sync connections"""
    cur = conn.cursor()
    cur.execute('PRAGMA journal_mode = WAL;')
    cur.execute('PRAGMA synchronous = NORMAL;')
    cur.execute('PRAGMA temp_store = MEMORY;')
    cur.close()

async_session_factory = async_sessionmaker(bind=engine, expire_on_commit=False)

async def get_async_session():
    """
    Rolling Get Database Function for FastAPI to get an 
    active asynchronous session connected to sqlite.

    Yields:
        AsyncSession: Async Session to perform DB transactions.
    """
    async with async_session_factory() as session:
        yield session